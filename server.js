import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import helmet from 'helmet';
import { WebSocketServer } from 'ws';
import { Client as SSHClient } from 'ssh2';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const TARGET_HOST = 'bandit.labs.overthewire.org';
const TARGET_PORT = 2220;
const MAX_ACTIVE_PER_IP = Number(process.env.MAX_ACTIVE_PER_IP || 4);

const app = express();
app.disable('x-powered-by');

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'", "ws:", "wss:"],
        fontSrc: ["'self'", "data:"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        frameAncestors: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

app.use((req, res, next) => {
  res.setHeader('Cache-Control', req.path.startsWith('/vendor/') ? 'public, max-age=86400' : 'no-store');
  next();
});

app.get('/health', (_req, res) => {
  res.json({ ok: true, target: TARGET_HOST, port: TARGET_PORT });
});

app.use('/vendor/xterm', express.static(path.join(__dirname, 'node_modules', '@xterm', 'xterm')));
app.use('/vendor/fit', express.static(path.join(__dirname, 'node_modules', '@xterm', 'addon-fit')));
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true, maxPayload: 16 * 1024 });

const activeByIp = new Map();

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || 'unknown';
}

function changeActive(ip, amount) {
  const next = Math.max(0, (activeByIp.get(ip) || 0) + amount);
  if (next === 0) activeByIp.delete(ip);
  else activeByIp.set(ip, next);
}

function validBanditUser(username) {
  const match = /^bandit(\d{1,2})$/.exec(String(username || ''));
  if (!match) return false;
  const n = Number(match[1]);
  return n >= 0 && n <= 33;
}

function safeNumber(value, fallback, min, max) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.floor(n)));
}

server.on('upgrade', (req, socket, head) => {
  if (req.url !== '/ssh') {
    socket.destroy();
    return;
  }

  const ip = getClientIp(req);
  if ((activeByIp.get(ip) || 0) >= MAX_ACTIVE_PER_IP) {
    socket.write('HTTP/1.1 429 Too Many Requests\r\nConnection: close\r\n\r\n');
    socket.destroy();
    return;
  }

  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit('connection', ws, req);
  });
});

wss.on('connection', (ws, req) => {
  const ip = getClientIp(req);
  changeActive(ip, 1);

  let ssh = null;
  let shell = null;
  let password = null;
  let started = false;
  let cleaned = false;

  const send = (payload) => {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(payload));
    }
  };

  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    password = null;
    try { shell?.end(); } catch {}
    try { ssh?.end(); } catch {}
    changeActive(ip, -1);
  };

  const fail = (message) => {
    send({ type: 'error', message });
    try { ws.close(1011, 'SSH connection failed'); } catch {}
  };

  const startSsh = ({ username, password: suppliedPassword, cols, rows }) => {
    if (started) return;
    started = true;

    if (!validBanditUser(username)) {
      fail('This teaching client only connects to Bandit users bandit0 through bandit33.');
      return;
    }

    if (typeof suppliedPassword !== 'string' || suppliedPassword.length === 0 || suppliedPassword.length > 256) {
      fail('Enter the password for this Bandit level.');
      return;
    }

    password = suppliedPassword;
    ssh = new SSHClient();

    ssh.on('keyboard-interactive', (_name, _instructions, _lang, prompts, finish) => {
      finish(prompts.map(() => password || ''));
    });

    ssh.on('ready', () => {
      send({ type: 'status', state: 'authenticated', message: `Authenticated as ${username}. Opening shell…` });

      ssh.shell(
        {
          term: 'xterm-256color',
          cols: safeNumber(cols, 100, 20, 300),
          rows: safeNumber(rows, 30, 5, 120),
        },
        (err, stream) => {
          password = null;

          if (err) {
            fail('SSH connected, but the remote shell could not be opened.');
            return;
          }

          shell = stream;
          send({ type: 'ready', username, host: TARGET_HOST, port: TARGET_PORT });

          stream.on('data', (data) => {
            send({ type: 'data', data: data.toString('utf8') });
          });

          stream.stderr?.on('data', (data) => {
            send({ type: 'data', data: data.toString('utf8') });
          });

          stream.on('close', () => {
            send({ type: 'status', state: 'closed', message: 'Remote shell closed.' });
            try { ws.close(1000, 'Remote shell closed'); } catch {}
          });
        }
      );
    });

    ssh.on('error', (err) => {
      password = null;
      const authFailure = /authentication/i.test(err.message || '');
      fail(authFailure ? 'Authentication failed. Check the username and password for this level.' : 'Could not reach the Bandit SSH server. Try again or tell your teacher.');
    });

    ssh.on('close', () => {
      password = null;
      if (ws.readyState === ws.OPEN) {
        send({ type: 'status', state: 'closed', message: 'SSH connection closed.' });
      }
    });

    ssh.connect({
      host: TARGET_HOST,
      port: TARGET_PORT,
      username,
      password,
      tryKeyboard: true,
      readyTimeout: 15000,
      keepaliveInterval: 10000,
      keepaliveCountMax: 3,
    });
  };

  ws.on('message', (raw) => {
    let message;
    try {
      message = JSON.parse(raw.toString());
    } catch {
      return;
    }

    if (!started && message.type === 'connect') {
      startSsh(message);
      return;
    }

    if (!shell) return;

    if (message.type === 'input' && typeof message.data === 'string' && message.data.length <= 8192) {
      shell.write(message.data);
    }

    if (message.type === 'resize') {
      const cols = safeNumber(message.cols, 100, 20, 300);
      const rows = safeNumber(message.rows, 30, 5, 120);
      try { shell.setWindow(rows, cols, 0, 0); } catch {}
    }
  });

  ws.on('close', cleanup);
  ws.on('error', cleanup);

  send({
    type: 'status',
    state: 'waiting',
    message: 'Secure web connection ready. Enter your Bandit password to connect.',
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Bandit Learning Terminal listening on port ${PORT}`);
});
