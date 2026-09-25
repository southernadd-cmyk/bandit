# Bandit Learning Terminal

A beginner-friendly teaching front end for [OverTheWire Bandit](https://overthewire.org/wargames/bandit/).

It gives students:

- a **real browser-based SSH terminal** powered by `ssh2` + xterm.js;
- a level-by-level guide from the initial connection through the available Bandit challenges;
- direct links to Linux command documentation;
- `man` buttons that type the relevant manual command into the live terminal;
- simple progress ticks stored only in the student's browser;
- no student account, local install, extension, or administrator rights.

## Why it works on managed college PCs

The student browser only connects to this web app over normal HTTPS/WSS (port 443).

```text
Student Chrome
     |
     | HTTPS / WSS :443
     v
Bandit Learning Terminal
     |
     | SSH :2220
     v
bandit.labs.overthewire.org
```

The Node server makes the SSH connection to OverTheWire. The student's machine does not need its own SSH client or direct outbound access to port 2220.

## Safety restrictions

This is deliberately **not a general-purpose web SSH proxy**.

The server hard-codes:

- host: `bandit.labs.overthewire.org`
- port: `2220`
- allowed usernames: `bandit0` through `bandit33`

The browser cannot supply a different host or port.

Passwords are held only long enough to authenticate the SSH connection. The application does not write passwords to logs, files, cookies, localStorage, or a database.

## Run locally

Requires Node.js 20+.

```bash
npm install
npm start
```

Open `http://localhost:3000`.

## Deploy on Railway

1. Create a Railway service from this GitHub repository.
2. Railway should detect the Node project automatically.
3. Start command: `npm start`
4. Health check path: `/health`
5. Add your custom domain, for example `bandit.toolsforteaching.co.uk`.
6. Confirm the Railway service can make outbound TCP connections to `bandit.labs.overthewire.org:2220`.

No secrets or environment variables are required for the normal deployment.

Optional:

- `MAX_ACTIVE_PER_IP` — maximum simultaneous browser terminal sessions from one public IP. Default: `4`.

## Teaching design

The level descriptions are concise teaching summaries of the current official Bandit goals rather than a copied mirror. Every level includes a link back to the corresponding OverTheWire page.

The interface intentionally provides **commands and concepts, not walkthrough solutions**. Students still need to read manuals, investigate the filesystem, interpret output, and decide how to combine commands.

Special cases are called out in the guide, including:

- the level that logs interactive SSH sessions out immediately;
- SSH private-key authentication;
- cron and shell-script levels;
- terminal/shell escape levels;
- Git-based levels that OverTheWire normally describes as local-machine tasks.

## Attribution

Bandit is created and operated by [OverTheWire](https://overthewire.org/). This project is an independent classroom front end and is not affiliated with or endorsed by OverTheWire.
