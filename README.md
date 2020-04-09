
# sandboxed-regexp

## Process untrusted regexes in JavaScript, with the power of Rust!

JavaScript's builtin [`RegExp`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
class is not suitable for working with regular expressions obtained from untrusted sources, because it can easily
fall victim to [Catastrophic Backtracking](https://www.regular-expressions.info/catastrophic.html).

Rust's [`regex`](https://docs.rs/regex/) crate, by contrast, is specifically designed to
[safely handle untrusted input](https://docs.rs/regex/#untrusted-input) without blowing up.

So let's use WebAssembly to bring this same safe handling of untrusted regexes from Rust to JavaScript,
with the addition of extra sandboxing!


## Building it

You'll need [`wasm-pack`](https://rustwasm.github.io/docs/wasm-pack/tutorials/npm-browser-packages/index.html).

Build the package using `make build`. Test that it works using `make test`.


## Using it

Like so:

```
const { SandboxedRegExp } = require('sandboxed-regexp');

// Problematic regex example from http://www.rexegg.com/regex-explosive-quantifiers.html
const FastRE = new SandboxedRegExp("^(A+)*B")

// This will run quickly to completion and output `false`.
console.log(FastRE.test("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC"));

// But if you try the same thing with the builtin RegExp class.
const SlowRE = new RegExp("^(A+)*B");

// Then this will churn CPU for several seconds before outputting `false`.
console.log(SlowRE.test("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC"));

// And this will churn CPU until you get sick of waiting and interrupt it.
console.log(SlowRE.test("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC"));
```


## Being Careful with it

Using the `SandboxedRegExp` class should feel fairly similar to using the
builtin `RegExp` class for simple use-cases, but it is in no way intended
to be a drop-in replacement.

It's missing the following features of the builtin class that might conceivably
be added by someone who needed them:

* No support for any methods besides `test` (such as `exec` or `match`).
* No support for capturing groups.
* No support for updating the `lastIndex` property after a match.

It has the following differences from the builtin class that will probably
always remain:

* It uses the [Rust crate's regex syntax](https://docs.rs/regex/#syntax).
  This should be the same as the JS syntax for simple cases but is likely
  to be very different around the edges.
    * In particular, this means no support for look-ahead or backreferences,
      which are popular non-regular enhancements to reglar expression syntax
      that are resistant to safe execution of untrusted inputs.
* Thorough unicode handling is on by default. This is most likely to show
  up in practice as character classes like `\w` matching unicode character
  classes rather than ASCII.

It has the following non-functional differences that might matter to you
at scale:

* You have to slurp in a few hundred kilobytes of wasm code.
* Testing against a `SandboxedRegExp` is cheap, but creating one is likely to
  be much more expensive than creating a builtin `RegExp`. If you're creating
  `SandboxedRegExp` instances in a loop, you're likely to have a bad time.
* Each `SandboxedRegExp` instance consumes more memory than a builtin `RegExp`
  instance. *Significantly* more. We might expose some knobs for tuning the
  memory use in future.
* Testing a string against a `SandboxedRegExp` involves copying that string
  into the wasm linear memory, which might get expensive if you're testing
  very large strings.
* If you're working with a particularly-badly-behaved regex, it might run out
  of memory or similar catastrophic failure behaviour that will be surfaced
  as an opaque wasm-related error. This could render the `SandboxedRegExp`
  object unusable, but the rest of your program should be fine.
