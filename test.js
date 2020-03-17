const {SandboxedRegExp} = require('./pkg/sandboxed-regexp')
s = new SandboxedRegExp('a+b');
console.log(s.test('a'));
console.log(s.test('ab'));
console.log(s.test('aab'));
console.log(s.test('aaaab'));
console.log(s.test('acb'));
console.log(s.test('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab'));
