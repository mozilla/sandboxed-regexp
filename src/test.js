
const {SandboxedRegExp} = require('../pkg/sandboxed-regexp');

// TODO: a proper test harness etc. This'll do for now.

const TESTCASES = {
  "a+b": {
    "a": false,
    "ab": true,
    "aab": true,
    "aaaab": true,
    "acb": false,
    "caab": true,
  },
  "^a.*b": {
    "a": false,
    "b": false,
    "aab": true,
    "acb": true,
    "a\nb": false,
    "caab": false,
  },
  "^(a*b*)+$": {
    "aaa": true,
    "aaaaac": false,
    "ababbbaaababbaaabbbaababbabbaaababbaaabbaaabbababaab": true,
  },
};

for (const pattern in TESTCASES) {
  for (const haystack in TESTCASES[pattern]) {
    const result = TESTCASES[pattern][haystack];
    if ((new RegExp(pattern)).test(haystack) !== result) {
      throw new Error(`Incorrect testcase: ${pattern} / ${haystack} !== ${result}`)
    }
    if ((new SandboxedRegExp(pattern)).test(haystack) !== result) {
      throw new Error(`Test failed: ${pattern} / ${haystack} !== ${result}`)
    }
  }
}

console.log("LGTM :thumbsup:");
