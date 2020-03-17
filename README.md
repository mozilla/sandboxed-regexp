
# sandboxed-regexp

## Process untrusted regexes in JavaScript, with the power of Rust!

JavaScript's builtin [`RegExp`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
class is not suitable for working with regular expressions obtained from untrusted sources, because it can easily
fall victim to [Catastrophic Backtracking](https://www.regular-expressions.info/catastrophic.html).

Rust's [`regex`](https://docs.rs/regex/) crate, by contrast, is specifically designed to
[safely handle untrusted input](https://docs.rs/regex/#untrusted-input) without blowing up.

So let's use WebAssembly to bring this same safe handling of untrusted regexes from Rust to JavaScript,
with the addition of extra sandboxing!


## Using it

Like so:

```
const { SandboxedRegExp } = require('sandboxed-regexp');

// Problematic regex example from http://www.rexegg.com/regex-explosive-quantifiers.html
const FastRE = SandboxedRegExp.new("^(A+)*B")

// This will run quickly to completion and output `false`.
console.log(FastRE.test("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC"));

// But if you try the same thing with the builtin RegExp class.
const SlowRE = new RegExp("^(A+)*B");

// Then this will churn CPU for several seconds before outputting `false`.
console.log(SlowRE.test("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC"));

// And this will churn CPU until you get sick of waiting and interrupt it.
console.log(SlowRE.test("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC"));
```

## Building it

You'll need [`wasm-pack`](https://rustwasm.github.io/docs/wasm-pack/tutorials/npm-browser-packages/index.html).

Build the package using `make build`.

## Using it
