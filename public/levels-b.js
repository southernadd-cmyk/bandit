window.BANDIT_LEVELS.push(...[
  {
    "id": 9,
    "label": "8 → 9",
    "title": "Level 8 → 9",
    "connectUser": "bandit8",
    "goal": "In data.txt, find the only line that occurs exactly once.",
    "commands": [
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
      "sorting",
      "counting duplicate lines",
      "pipes"
    ],
    "source": "https://overthewire.org/wargames/bandit/bandit9.html"
  },
  {
    "id": 10,
    "label": "9 → 10",
    "title": "Level 9 → 10",
    "connectUser": "bandit9",
    "goal": "data.txt contains mostly non-readable data. Find one of its readable strings that is preceded by several = characters.",
    "commands": [
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
      "binary vs text",
      "extracting strings"
    ],
    "source": "https://overthewire.org/wargames/bandit/bandit10.html"
  },
  {
    "id": 11,
    "label": "10 → 11",
    "title": "Level 10 → 11",
    "connectUser": "bandit10",
    "goal": "The contents of data.txt are Base64 encoded. Decode the data to reveal the next password.",
    "commands": [
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
      "encoding vs encryption",
      "Base64"
    ],
    "source": "https://overthewire.org/wargames/bandit/bandit11.html"
  },
  {
    "id": 12,
    "label": "11 → 12",
    "title": "Level 11 → 12",
    "connectUser": "bandit11",
    "goal": "The letters in data.txt have been rotated by 13 positions. Reverse that transformation.",
    "commands": [
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
      "ROT13",
      "character translation"
    ],
    "source": "https://overthewire.org/wargames/bandit/bandit12.html"
  },
  {
    "id": 13,
    "label": "12 → 13",
    "title": "Level 12 → 13",
    "connectUser": "bandit12",
    "goal": "data.txt is a hex dump of a file that has been compressed repeatedly. Reconstruct it, identify each format, and unpack it step by step.",
    "commands": [
      "grep",
      "sort",
      "uniq",
      "strings",
      "base64",
      "tr",
      "tar",
      "gzip",
      "bzip2",
      "xxd",
      "mkdir",
      "cp",
      "mv",
      "file"
    ],
    "concepts": [
      "hex dumps",
      "compression formats",
      "temporary working directories"
    ],
    "source": "https://overthewire.org/wargames/bandit/bandit13.html",
    "note": "OverTheWire suggests making a temporary working directory. Avoid working directly on the supplied file."
  },
  {
    "id": 14,
    "label": "13 → 14",
    "title": "Level 13 → 14",
    "connectUser": "bandit13",
    "goal": "Instead of receiving a password, you have been given a private SSH key. Work out how to use that key to access the next Bandit account.",
    "commands": [
      "ssh",
      "scp",
      "umask",
      "chmod",
      "cat",
      "nc",
      "install"
    ],
    "concepts": [
      "SSH keys",
      "file permissions",
      "key authentication"
    ],
    "source": "https://overthewire.org/wargames/bandit/bandit14.html",
    "note": "You can make the next SSH connection from inside this live terminal, so you do not need to download the private key to the college PC."
  },
  {
    "id": 15,
    "label": "14 → 15",
    "title": "Level 14 → 15",
    "connectUser": "bandit14",
    "goal": "Send the current level password to the service listening on localhost port 30000 to obtain the next password.",
    "commands": [
      "ssh",
      "telnet",
      "nc",
      "openssl",
      "nmap"
    ],
    "concepts": [
      "localhost",
      "TCP ports",
      "network clients"
    ],
    "source": "https://overthewire.org/wargames/bandit/bandit15.html"
  },
  {
    "id": 16,
    "label": "15 → 16",
    "title": "Level 15 → 16",
    "connectUser": "bandit15",
    "goal": "Submit the current password to localhost port 30001, this time using an SSL/TLS encrypted connection.",
    "commands": [
      "ssh",
      "telnet",
      "nc",
      "ncat",
      "socat",
      "openssl",
      "nmap",
      "netstat",
      "ss"
    ],
    "concepts": [
      "TLS",
      "encrypted connections",
      "client/server"
    ],
    "source": "https://overthewire.org/wargames/bandit/bandit16.html"
  },
  {
    "id": 17,
    "label": "16 → 17",
    "title": "Level 16 → 17",
    "connectUser": "bandit16",
    "goal": "Find the listening services between ports 31000 and 32000, identify which use SSL/TLS, then find the one that returns the next credentials.",
    "commands": [
      "ssh",
      "telnet",
      "nc",
      "ncat",
      "socat",
      "openssl",
      "nmap",
      "netstat",
      "ss"
    ],
    "concepts": [
      "port scanning",
      "service identification",
      "TLS"
    ],
    "source": "https://overthewire.org/wargames/bandit/bandit17.html"
  }
]);
