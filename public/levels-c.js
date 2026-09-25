window.BANDIT_LEVELS.push(...[
  {
    "id": 18,
    "label": "17 → 18",
    "title": "Level 17 → 18",
    "connectUser": "bandit17",
    "goal": "Compare passwords.old with passwords.new. The next password is the one line that changed.",
    "commands": [
      "cat",
      "grep",
      "ls",
      "diff"
    ],
    "concepts": [
      "file comparison",
      "differences"
    ],
    "source": "https://overthewire.org/wargames/bandit/bandit18.html"
  },
  {
    "id": 19,
    "label": "18 → 19",
    "title": "Level 18 → 19",
    "connectUser": "bandit18",
    "goal": "The next password is in readme, but the account's shell startup file immediately logs you out during a normal interactive SSH login. Find another way to use SSH to read the file.",
    "commands": [
      "ssh",
      "ls",
      "cat"
    ],
    "concepts": [
      "remote commands",
      "interactive vs non-interactive SSH"
    ],
    "source": "https://overthewire.org/wargames/bandit/bandit19.html",
    "note": "A direct browser-terminal login to bandit18 may immediately close. That behaviour is part of the challenge, not a bug in this site. Work from the previous live shell."
  },
  {
    "id": 20,
    "label": "19 → 20",
    "title": "Level 19 → 20",
    "connectUser": "bandit19",
    "goal": "Use the setuid program in the home directory. Run it without arguments first to learn how it works, then use it to access the usual password location.",
    "commands": [
      "ls",
      "cat"
    ],
    "concepts": [
      "setuid",
      "effective user identity",
      "program usage"
    ],
    "source": "https://overthewire.org/wargames/bandit/bandit20.html"
  },
  {
    "id": 21,
    "label": "20 → 21",
    "title": "Level 20 → 21",
    "connectUser": "bandit20",
    "goal": "The setuid program connects to a localhost port that you provide, reads one line, and checks it against the current password. Build the other side of that connection so the program can talk to it.",
    "commands": [
      "ssh",
      "nc",
      "cat",
      "bash",
      "screen",
      "tmux",
      "jobs"
    ],
    "concepts": [
      "network listeners",
      "background jobs",
      "process control"
    ],
    "source": "https://overthewire.org/wargames/bandit/bandit21.html"
  },
  {
    "id": 22,
    "label": "21 → 22",
    "title": "Level 21 → 22",
    "connectUser": "bandit21",
    "goal": "A job runs automatically through cron. Inspect /etc/cron.d/ to discover what command is being run and follow the trail.",
    "commands": [
      "cron",
      "crontab",
      "cat",
      "ls"
    ],
    "concepts": [
      "scheduled jobs",
      "cron configuration"
    ],
    "source": "https://overthewire.org/wargames/bandit/bandit22.html"
  },
  {
    "id": 23,
    "label": "22 → 23",
    "title": "Level 22 → 23",
    "connectUser": "bandit22",
    "goal": "Another cron job runs regularly. Inspect its configuration and then read the shell script it launches to work out where the next password goes.",
    "commands": [
      "cron",
      "crontab",
      "cat",
      "ls",
      "bash"
    ],
    "concepts": [
      "reading shell scripts",
      "cron",
      "variables"
    ],
    "source": "https://overthewire.org/wargames/bandit/bandit23.html"
  },
  {
    "id": 24,
    "label": "23 → 24",
    "title": "Level 23 → 24",
    "connectUser": "bandit23",
    "goal": "Investigate the cron job and create your own small shell script so that the scheduled process does useful work for you.",
    "commands": [
      "chmod",
      "cron",
      "crontab",
      "cat",
      "bash",
      "mkdir",
      "cp"
    ],
    "concepts": [
      "shell scripts",
      "permissions",
      "cron execution"
    ],
    "source": "https://overthewire.org/wargames/bandit/bandit24.html",
    "note": "The cron process removes submitted scripts after running them, so keep a copy while you test."
  },
  {
    "id": 25,
    "label": "24 → 25",
    "title": "Level 24 → 25",
    "connectUser": "bandit24",
    "goal": "A service on port 30002 expects the current password plus a four-digit PIN. The PIN must be found by trying the 10,000 possibilities efficiently without reconnecting each time.",
    "commands": [
      "nc",
      "bash"
    ],
    "concepts": [
      "loops",
      "automation",
      "brute-force search space"
    ],
    "source": "https://overthewire.org/wargames/bandit/bandit25.html"
  },
  {
    "id": 26,
    "label": "25 → 26",
    "title": "Level 25 → 26",
    "connectUser": "bandit25",
    "goal": "Access bandit26. Its login shell is not Bash, so investigate what shell is configured, understand its behaviour, and find a way to escape it.",
    "commands": [
      "ssh",
      "cat",
      "more",
      "vi",
      "ls",
      "id",
      "pwd"
    ],
    "concepts": [
      "login shells",
      "pagers",
      "terminal size"
    ],
    "source": "https://overthewire.org/wargames/bandit/bandit26.html",
    "note": "Because this site uses a real xterm-compatible browser terminal, the intended terminal-resizing behaviour can be practised here."
  }
]);
