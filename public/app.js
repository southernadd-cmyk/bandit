(() => {
  const levels = window.BANDIT_LEVELS || [];
  const commandInfo = window.COMMAND_INFO || {};
  const config = window.BANDIT_CONFIG || { mode: 'same-origin' };
  const STORAGE_KEY = 'bandit-learning-progress-v1';

  const els = {
    levelNav: document.getElementById('levelNav'),
    progressText: document.getElementById('progressText'),
    progressFill: document.getElementById('progressFill'),
    resetProgressBtn: document.getElementById('resetProgressBtn'),
    levelEyebrow: document.getElementById('levelEyebrow'),
    levelTitle: document.getElementById('levelTitle'),
    levelGoal: document.getElementById('levelGoal'),
    levelNote: document.getElementById('levelNote'),
    conceptList: document.getElementById('conceptList'),
    commandList: document.getElementById('commandList'),
    sourceLink: document.getElementById('sourceLink'),
    usernameInput: document.getElementById('usernameInput'),
    passwordInput: document.getElementById('passwordInput'),
    togglePasswordBtn: document.getElementById('togglePasswordBtn'),
    connectBtn: document.getElementById('connectBtn'),
    disconnectBtn: document.getElementById('disconnectBtn'),
    connectionStatus: document.getElementById('connectionStatus'),
    statusText: document.getElementById('statusText'),
    terminal: document.getElementById('terminal'),
    completeBtn: document.getElementById('completeBtn'),
    toastRegion: document.getElementById('toastRegion'),
    hostingNotice: document.getElementById('hostingNotice'),
  };

  let currentLevelId = 0;
  let socket = null;
  let connected = false;
  let fitTimer = null;

  const terminal = new Terminal({
    cursorBlink: true,
    convertEol: false,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
    fontSize: 14,
    lineHeight: 1.2,
    scrollback: 5000,
    theme: {
      background: '#080d12',
      foreground: '#ecf3f0',
      cursor: '#b5f26b',
      cursorAccent: '#080d12',
      selectionBackground: '#345d42',
      black: '#090e13',
      brightBlack: '#738187',
      green: '#b5f26b',
      brightGreen: '#cbff91',
      yellow: '#ffd283',
      brightYellow: '#ffe3ad',
      red: '#ff9b9b',
      brightRed: '#ffadad',
      blue: '#8fb8ff',
      brightBlue: '#b2ceff',
      cyan: '#7ee6e6',
      brightCyan: '#a3ffff',
      magenta: '#d5a6ff',
      brightMagenta: '#e6c8ff',
      white: '#ecf3f0',
      brightWhite: '#ffffff',
    },
  });

  const fitAddon = new FitAddon.FitAddon();
  terminal.loadAddon(fitAddon);
  terminal.open(els.terminal);
  fitAddon.fit();
  terminal.writeln('\x1b[1;32mBandit Learning Terminal\x1b[0m');
  terminal.writeln('Choose a level, enter the password you discovered, then press Connect.');
  terminal.writeln('The terminal below is a real SSH session to OverTheWire Bandit.\r\n');

  function loadProgress() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return new Set(Array.isArray(parsed) ? parsed.map(Number) : []);
    } catch {
      return new Set();
    }
  }

  let completed = loadProgress();

  function saveProgress() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed].sort((a, b) => a - b)));
  }

  function toast(message, kind = 'info') {
    const item = document.createElement('div');
    item.className = `toast ${kind === 'error' ? 'error' : ''}`;
    item.textContent = message;
    els.toastRegion.appendChild(item);
    window.setTimeout(() => item.remove(), 3600);
  }

  function setStatus(state, message) {
    els.connectionStatus.dataset.state = state;
    els.statusText.textContent = message;
  }

  function manUrl(command) {
    return `https://manpages.ubuntu.com/cgi-bin/search.py?q=${encodeURIComponent(command)}`;
  }

  function renderNav() {
    els.levelNav.innerHTML = '';
    levels.forEach((level) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'level-button';
      if (level.id === currentLevelId) button.classList.add('active');
      if (level.id === currentLevelId) button.setAttribute('aria-current', 'step');
      if (completed.has(level.id)) button.classList.add('complete');
      button.setAttribute('aria-label', level.label + (completed.has(level.id) ? ', complete' : ''));

      const number = document.createElement('span');
      number.className = 'level-number';
      number.textContent = completed.has(level.id) ? '✓' : level.id;

      const label = document.createElement('span');
      label.textContent = level.label;

      button.append(number, label);
      button.addEventListener('click', () => selectLevel(level.id));
      els.levelNav.appendChild(button);
    });

    const challengeCount = [...completed].filter((id) => id >= 1 && id <= 33).length;
    els.progressText.textContent = `${challengeCount} / 33 challenges`;
    els.progressFill.style.width = `${Math.round(challengeCount / 33 * 100)}%`;
  }

  function renderCommands(level) {
    els.commandList.innerHTML = '';
    if (!level.commands.length) {
      const finished = document.createElement('span');
      finished.className = 'concept-chip';
      finished.textContent = 'No new commands — you made it.';
      els.commandList.appendChild(finished);
      return;
    }

    level.commands.forEach((command) => {
      const card = document.createElement('div');
      card.className = 'command-card';

      const code = document.createElement('code');
      code.textContent = command;

      const desc = document.createElement('span');
      desc.textContent = commandInfo[command] || 'Read the manual page to find out what this command does.';

      const actions = document.createElement('div');
      actions.className = 'command-actions';

      const docs = document.createElement('a');
      docs.href = manUrl(command);
      docs.target = '_blank';
      docs.rel = 'noreferrer';
      docs.textContent = 'docs';
      docs.title = `Open Ubuntu manual search for ${command}`;

      const manButton = document.createElement('button');
      manButton.type = 'button';
      manButton.textContent = 'man';
      manButton.title = `Run: man ${command}`;
      manButton.addEventListener('click', () => {
        if (!connected || !socket || socket.readyState !== WebSocket.OPEN) {
          toast('Connect to Bandit first, then the site can type the man command into your terminal.');
          return;
        }
        socket.send(JSON.stringify({ type: 'input', data: `man ${command}\r` }));
        terminal.focus();
      });

      actions.append(docs, manButton);
      card.append(code, desc, actions);
      els.commandList.appendChild(card);
    });
  }

  function selectLevel(id) {
    const level = levels.find((item) => item.id === id);
    if (!level) return;
    currentLevelId = id;

    els.levelEyebrow.textContent = id === 0 ? 'Getting started' : id === 34 ? 'Complete' : `Challenge ${level.label}`;
    els.levelTitle.textContent = level.title;
    els.levelGoal.textContent = level.goal;
    els.sourceLink.href = level.source;
    els.usernameInput.value = level.connectUser;

    els.levelNote.hidden = !level.note;
    els.levelNote.textContent = level.note || '';

    els.conceptList.innerHTML = '';
    level.concepts.forEach((concept) => {
      const chip = document.createElement('span');
      chip.className = 'concept-chip';
      chip.textContent = concept;
      els.conceptList.appendChild(chip);
    });

    renderCommands(level);

    if (!connected) {
      els.passwordInput.value = level.starterPassword || '';
      els.passwordInput.placeholder = level.starterPassword ? 'Starter password loaded' : `Password for ${level.connectUser}`;
    } else {
      els.passwordInput.value = '';
      els.passwordInput.placeholder = `Disconnect before reconnecting as ${level.connectUser}`;
    }

    const isDone = completed.has(level.id);
    els.completeBtn.classList.toggle('done', isDone);
    els.completeBtn.textContent = isDone ? 'Challenge marked complete ✓' : (id === 0 ? 'Mark setup complete ✓' : 'Mark challenge complete ✓');

    renderNav();
  }

  function disconnect({ quiet = false } = {}) {
    if (socket) {
      try { socket.close(1000, 'Student disconnected'); } catch {}
    }
    socket = null;
    connected = false;
    els.connectBtn.disabled = false;
    els.disconnectBtn.disabled = true;
    els.passwordInput.disabled = false;
    els.usernameInput.disabled = false;
    els.passwordInput.value = '';
    setStatus('offline', 'Not connected');
    if (!quiet) toast('Disconnected from Bandit.');
  }

  function buildSocketUrl() {
    if (config.backendUrl) {
      const backend = new URL(config.backendUrl, location.href);
      backend.protocol = backend.protocol === 'https:' ? 'wss:' : 'ws:';
      backend.pathname = `${backend.pathname.replace(/\/$/, '')}/ssh`;
      backend.search = '';
      backend.hash = '';
      return backend.toString();
    }
    const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${location.host}/ssh`;
  }

  function connect() {
    if (config.mode === 'disabled') {
      toast('The GitHub Pages preview is guide-only. Live SSH needs the hosted Node gateway.', 'error');
      return;
    }
    if (socket && socket.readyState <= WebSocket.OPEN) {
      disconnect({ quiet: true });
    }

    const password = els.passwordInput.value;
    const username = els.usernameInput.value;

    if (!password) {
      toast('Enter the password for this level.', 'error');
      els.passwordInput.focus();
      return;
    }

    socket = new WebSocket(buildSocketUrl());

    els.connectBtn.disabled = true;
    els.disconnectBtn.disabled = false;
    els.passwordInput.disabled = true;
    els.usernameInput.disabled = true;
    setStatus('connecting', `Connecting as ${username}…`);
    terminal.focus();

    socket.addEventListener('open', () => {
      fitAddon.fit();
      socket.send(JSON.stringify({
        type: 'connect',
        username,
        password,
        cols: terminal.cols,
        rows: terminal.rows,
      }));
      els.passwordInput.value = '';
    });

    socket.addEventListener('message', (event) => {
      let message;
      try { message = JSON.parse(event.data); } catch { return; }

      if (message.type === 'data') {
        terminal.write(message.data);
        return;
      }

      if (message.type === 'ready') {
        connected = true;
        setStatus('online', `Connected as ${message.username}`);
        toast(`Connected to Bandit as ${message.username}.`);
        terminal.focus();
        return;
      }

      if (message.type === 'status') {
        if (message.state === 'authenticated') setStatus('connecting', message.message);
        else if (message.state === 'closed') setStatus('offline', message.message);
        else setStatus('connecting', message.message);
        return;
      }

      if (message.type === 'error') {
        setStatus('error', message.message);
        toast(message.message, 'error');
      }
    });

    socket.addEventListener('close', () => {
      connected = false;
      socket = null;
      els.connectBtn.disabled = false;
      els.disconnectBtn.disabled = true;
      els.passwordInput.disabled = false;
      els.usernameInput.disabled = false;
      els.passwordInput.value = '';
      if (els.connectionStatus.dataset.state !== 'error') {
        setStatus('offline', 'Not connected');
      }
    });

    socket.addEventListener('error', () => {
      setStatus('error', 'WebSocket connection failed.');
      toast('The browser could not reach the SSH gateway. Check the deployment and WebSocket support.', 'error');
    });
  }

  terminal.onData((data) => {
    if (connected && socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'input', data }));
    }
  });

  function resizeTerminal() {
    clearTimeout(fitTimer);
    fitTimer = setTimeout(() => {
      try {
        fitAddon.fit();
        if (connected && socket?.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: 'resize', cols: terminal.cols, rows: terminal.rows }));
        }
      } catch {}
    }, 70);
  }

  const observer = new ResizeObserver(resizeTerminal);
  observer.observe(els.terminal);
  window.addEventListener('resize', resizeTerminal);

  els.connectBtn.addEventListener('click', connect);
  els.disconnectBtn.addEventListener('click', () => disconnect());
  els.passwordInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !els.connectBtn.disabled) connect();
  });

  els.togglePasswordBtn.addEventListener('click', () => {
    const show = els.passwordInput.type === 'password';
    els.passwordInput.type = show ? 'text' : 'password';
    els.togglePasswordBtn.textContent = show ? 'Hide' : 'Show';
    els.togglePasswordBtn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  });

  els.completeBtn.addEventListener('click', () => {
    if (completed.has(currentLevelId)) completed.delete(currentLevelId);
    else completed.add(currentLevelId);
    saveProgress();
    selectLevel(currentLevelId);
  });

  els.resetProgressBtn.addEventListener('click', () => {
    if (!confirm('Reset the challenge ticks on this browser? No Bandit passwords are stored by this site.')) return;
    completed = new Set();
    saveProgress();
    selectLevel(currentLevelId);
    toast('Progress ticks reset.');
  });

  window.addEventListener('beforeunload', () => {
    try { socket?.close(); } catch {}
  });

  renderNav();
  selectLevel(0);

  if (config.mode === 'disabled') {
    els.hostingNotice.hidden = false;
    els.hostingNotice.textContent = 'GitHub Pages preview: the level guide and command references work here, but live SSH requires the Node gateway. The terminal will be enabled when this frontend is pointed at that backend.';
    els.connectBtn.disabled = true;
    els.disconnectBtn.disabled = true;
    els.passwordInput.disabled = true;
    els.togglePasswordBtn.disabled = true;
    setStatus('offline', 'Guide-only preview');
    terminal.writeln('\x1b[1;33mGitHub Pages preview: live SSH is currently disabled.\x1b[0m');
  }
})();
