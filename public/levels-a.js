window.BANDIT_LEVELS = [
  {
    "id": 0,
    "label": "Connect",
    "title": "Level 0 — Connect to Bandit",
    "connectUser": "bandit0",
    "goal": "Connect to the Bandit server with SSH. The Bandit host is fixed for you; enter the starter password and open the terminal.",
    "commands": [
      "ssh"
    ],
    "concepts": [
      "SSH",
      "hostnames",
      "ports"
    ],
    "source": "https://overthewire.org/wargames/bandit/bandit0.html",
    "starterPassword": "bandit0",
    "note": "This is the only level with a public starter password. After this, each password is discovered by completing the previous challenge."
  },
  {
    "id": 1,
    "label": "0 → 1",
    "title": "Level 0 → 1",
    "connectUser": "bandit0",
    "goal": "The next password is in a file named readme in your home directory. Find and read it.",
    "commands": [
      "ls",
      "cd",
      "cat",
      "file",
      "du",
      "find"
    ],
    "concepts": [
      "home directory",
      "listing files",
      "reading text files"
    ],
    "source": "https://overthewire.org/wargames/bandit/bandit1.html"
  },
  {
    "id": 2,
    "label": "1 → 2",
    "title": "Level 1 → 2",
    "connectUser": "bandit1",
    "goal": "The next password is stored in a file whose name is a single dash (-) in the home directory.",
    "commands": [
      "ls",
      "cd",
      "cat",
      "file",
      "du",
      "find"
    ],
    "concepts": [
      "special filenames",
      "command arguments"
    ],
    "source": "https://overthewire.org/wargames/bandit/bandit2.html"
  },
  {
    "id": 3,
    "label": "2 → 3",
    "title": "Level 2 → 3",
    "connectUser": "bandit2",
    "goal": "Find the next password in the home-directory file whose filename contains spaces.",
    "commands": [
      "ls",
      "cd",
      "cat",
      "file",
      "du",
      "find"
    ],
    "concepts": [
      "spaces in filenames",
      "quoting and escaping"
    ],
    "source": "https://overthewire.org/wargames/bandit/bandit3.html"
  },
  {
    "id": 4,
    "label": "3 → 4",
    "title": "Level 3 → 4",
    "connectUser": "bandit3",
    "goal": "The next password is in a hidden file inside the inhere directory.",
    "commands": [
      "ls",
      "cd",
      "cat",
      "file",
      "du",
      "find"
    ],
    "concepts": [
      "hidden files",
      "directories"
    ],
    "source": "https://overthewire.org/wargames/bandit/bandit4.html"
  },
  {
    "id": 5,
    "label": "4 → 5",
    "title": "Level 4 → 5",
    "connectUser": "bandit4",
    "goal": "Inside inhere, identify the only file that contains human-readable data and read it.",
    "commands": [
      "ls",
      "cd",
      "cat",
      "file",
      "du",
      "find",
      "reset"
    ],
    "concepts": [
      "file types",
      "human-readable data"
    ],
    "source": "https://overthewire.org/wargames/bandit/bandit5.html"
  },
  {
    "id": 6,
    "label": "5 → 6",
    "title": "Level 5 → 6",
    "connectUser": "bandit5",
    "goal": "Search beneath inhere for a file that is human-readable, exactly 1033 bytes, and not executable.",
    "commands": [
      "ls",
      "cd",
      "cat",
      "file",
      "du",
      "find"
    ],
    "concepts": [
      "search criteria",
      "file size",
      "permissions"
    ],
    "source": "https://overthewire.org/wargames/bandit/bandit6.html"
  },
  {
    "id": 7,
    "label": "6 → 7",
    "title": "Level 6 → 7",
    "connectUser": "bandit6",
    "goal": "Search the server for the 33-byte file owned by user bandit7 and group bandit6.",
    "commands": [
      "ls",
      "cd",
      "cat",
      "file",
      "du",
      "find",
      "grep"
    ],
    "concepts": [
      "ownership",
      "groups",
      "searching the filesystem"
    ],
    "source": "https://overthewire.org/wargames/bandit/bandit7.html"
  },
  {
    "id": 8,
    "label": "7 → 8",
    "title": "Level 7 → 8",
    "connectUser": "bandit7",
    "goal": "In data.txt, locate the password that appears beside the word millionth.",
    "commands": [
      "man",
      "grep",
      "sort",
      "uniq",
      "strings",
      "base64",
      "tr",
      "tar",
      "gzip",
      "bzip2",
      "xxd"
    ],
    "concepts": [
      "searching text",
      "patterns"
    ],
    "source": "https://overthewire.org/wargames/bandit/bandit8.html"
  }
];
