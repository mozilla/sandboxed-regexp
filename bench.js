// Super scientific comparison of previous vs proposed approach.

const safeRegex = require('safe-regex');
const Sandbox = require('sandbox');
const {SandboxedRegExp } = require('./pkg/sandboxed-regexp')

function old_way(regex, emailAddress) {
  return new Promise(resolve => {
    if (
      regex.indexOf('"') !== -1 ||
      emailAddress.indexOf('"') !== -1 ||
      !safeRegex(regex)
    ) {
      resolve(false);
      return;
    }

    // Execute the regex inside a sandbox and kill it if it takes > 100 ms
    const sandbox = new Sandbox({ timeout: 100 });
    sandbox.run(`new RegExp("${regex}").test("${emailAddress}")`, output => {
      resolve(output.result === 'true');
    });
  });
}

function new_way(regex, emailAddress) {
  return new Promise(resolve => {
    const r = new SandboxedRegExp(regex);
    resolve(r.test(emailAddress));
  });
}

async function timeit(func, regex, emailAddresses) {
  const start = process.hrtime.bigint();
  for (const emailAddress of emailAddresses) {
    await func(regex, emailAddress);
  }
  const end = process.hrtime.bigint();
  return parseInt(end - start);
}

EMAILS = []
for (let i = 0; i < 200; i++) {
    EMAILS.push("test" + i + "@example.com");
}

const results = {
  old_way: [],
  new_way: [],
}

async function runem() {
  results.old_way.push(await timeit(old_way, "^.+@example.com$", EMAILS));
  console.log(results);
  results.new_way.push(await timeit(new_way, "^.+@example.com$", EMAILS));
  console.log(results);
  results.old_way.push(await timeit(old_way, "^.+@example.com$", EMAILS));
  console.log(results);
  results.new_way.push(await timeit(new_way, "^.+@example.com$", EMAILS));
  console.log(results);
  results.old_way.push(await timeit(old_way, "^.+@example.com$", EMAILS));
  console.log(results);
  results.new_way.push(await timeit(new_way, "^.+@example.com$", EMAILS));
  console.log(results);
}

runem().then(() => {
  const old_way_best = Math.min(...results.old_way);
  const new_way_best = Math.min(...results.new_way);
  console.log(old_way_best, new_way_best);
  if (new_way_best < old_way_best) {
    console.log("New way is", (old_way_best / new_way_best), "times faster :-)");
  } else {
    console.log("New way is", (new_way_best / old_way_best), "times slower :-(");
  }
});;
