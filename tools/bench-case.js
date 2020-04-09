//
// A single test run for comparing performance of `RegExp` and `SandboxedRegExp`.
// When run like this:
//
//    bench-case.js <which> <count> <iters> <input_file> <length>
//
// It will generate <count> instances of <which> regexp class, then execute
// each one <iters> times over the first <length> bytes of <input_file>.
//
// If you measure the resource usage of this script over several runs with
// different parameters, maybe you can tell something interesting about the
// different characteristics of the two regexp engines.
//

const fs = require('fs');
const { SandboxedRegExp } = require('../pkg/sandboxed-regexp')

let [_exe, _script, which, count, iters, input_file, length, ..._rest] = process.argv;

let Class = null;
if (which === "builtin") {
  Class = RegExp;
}
if (which === "sandboxed") {
  Class = SandboxedRegExp
}
if (Class === null) {
  throw new Error(`Unknown regexp class: ${which}`);
}

count = parseInt(count);
iters = parseInt(iters);

let input = "";
if (iters > 0) {
  input = fs.readFileSync(input_file).toString('utf-8');
  if (length) {
    input = input.substr(0, parseInt(length));
  }
}

// Paterns yoinked from the regex-dna shootout example
// https://github.com/rust-lang/regex/blob/master/examples/shootout-regex-dna.rs

const PATTERNS = [
  "agggtaaa|tttaccct",
  "[cgt]gggtaaa|tttaccc[acg]",
  "a[act]ggtaaa|tttacc[agt]t",
  "ag[act]gtaaa|tttac[agt]ct",
  "agg[act]taaa|ttta[agt]cct",
  "aggg[acg]aaa|ttt[cgt]ccct",
  "agggt[cgt]aa|tt[acg]accct",
  "agggta[cgt]a|t[acg]taccct",
  "agggtaa[cgt]|[acg]ttaccct",
]

// Keep references to all created regexp objects,
// to get a sense of incremental memory usage.

const objs = [];
let result = false;
while(count-- > 0) {
  const r = new Class(PATTERNS[count % PATTERNS.length]);
  objs.push(r);
  for (let i =0; i < iters; i++) {
    result ^= r.test(input);
  }
}

// Try to convince node not to optimize away all those assignments.
console.log(objs, result);