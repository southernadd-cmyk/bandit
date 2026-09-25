window.BANDIT_LEVELS.push(...[
  {
    "id": 27,
    "label": "26 → 27",
    "title": "Level 26 → 27",
    "connectUser": "bandit26",
    "goal": "Once you have escaped into a usable shell, locate the password for bandit27.",
    "commands": [
      "ls",
      "cat"
    ],
    "concepts": [
      "shell escape follow-up",
      "locating credentials"
    ],
    "source": "https://overthewire.org/wargames/bandit/bandit27.html"
  },
  {
    "id": 28,
    "label": "27 → 28",
    "title": "Level 27 → 28",
    "connectUser": "bandit27",
    "goal": "A Git repository is available over SSH using the bandit27-git account. Clone it into a temporary working directory and investigate the repository for the next password.",
    "commands": [
      "git",
      "ssh",
      "mktemp"
    ],
    "concepts": [
      "Git clone",
      "SSH repository URLs",
      "working copies"
    ],
    "source": "https://overthewire.org/wargames/bandit/bandit28.html",
    "note": "OverTheWire describes this as a local-machine task. On managed college PCs, you can attempt the Git work from a temporary directory in your current Bandit shell instead of installing Git locally."
  },
  {
    "id": 29,
    "label": "28 → 29",
    "title": "Level 28 → 29",
    "connectUser": "bandit28",
    "goal": "Clone the next Git repository and investigate more than just the current file contents to find what changed.",
    "commands": [
      "git",
      "ssh",
      "mktemp"
    ],
    "concepts": [
      "Git history",
      "commits",
      "diffs"
    ],
    "source": "https://overthewire.org/wargames/bandit/bandit29.html",
    "note": "Use the repository history as evidence; do not assume the newest file content tells the whole story."
  },
  {
    "id": 30,
    "label": "29 → 30",
    "title": "Level 29 → 30",
    "connectUser": "bandit29",
    "goal": "Clone the repository and investigate Git references beyond the branch you land on initially.",
    "commands": [
      "git",
      "ssh",
      "mktemp"
    ],
    "concepts": [
      "branches",
      "refs",
      "Git history"
    ],
    "source": "https://overthewire.org/wargames/bandit/bandit30.html"
  },
  {
    "id": 31,
    "label": "30 → 31",
    "title": "Level 30 → 31",
    "connectUser": "bandit30",
    "goal": "Clone the repository and investigate Git metadata that can point at specific objects or versions.",
    "commands": [
      "git",
      "ssh",
      "mktemp"
    ],
    "concepts": [
      "tags",
      "Git objects",
      "refs"
    ],
    "source": "https://overthewire.org/wargames/bandit/bandit31.html"
  },
  {
    "id": 32,
    "label": "31 → 32",
    "title": "Level 31 → 32",
    "connectUser": "bandit31",
    "goal": "Clone the repository, read its instructions carefully, and use Git to add and send the required file despite repository ignore rules.",
    "commands": [
      "git",
      "ssh",
      "mktemp"
    ],
    "concepts": [
      "staging",
      "commits",
      "push",
      "ignore rules"
    ],
    "source": "https://overthewire.org/wargames/bandit/bandit32.html"
  },
  {
    "id": 33,
    "label": "32 → 33",
    "title": "Level 32 → 33",
    "connectUser": "bandit32",
    "goal": "You are placed in an unusual uppercase shell. Work out how the shell transforms input and escape to a normal shell.",
    "commands": [
      "sh",
      "man"
    ],
    "concepts": [
      "shell behaviour",
      "environment",
      "escaping restricted shells"
    ],
    "source": "https://overthewire.org/wargames/bandit/bandit33.html"
  },
  {
    "id": 34,
    "label": "Finish",
    "title": "Bandit complete",
    "connectUser": "bandit33",
    "goal": "There is currently no Level 34 challenge. If you reached bandit33, you have completed the available Bandit levels.",
    "commands": [],
    "concepts": [
      "review",
      "reflection"
    ],
    "source": "https://overthewire.org/wargames/bandit/bandit34.html",
    "note": "Use the progress screen to review which Linux and networking skills you practised."
  }
]);
