//
// A super-duper-scientific attempt to compare perf to the builtin `RegExp` object.
// We're interested in construction time, execution time, and memory consumption.
//

const path = require('path');
const fs = require('fs');
const cp = require('child_process');

function runCmd(cmd, args) {
  const result = cp.spawnSync(cmd, args);
  if (result.error) {
    throw result.error
  }
  if (result.status !== 0) {
    process.stderr.write(result.stderr);
    throw new Error("Cmd failed!", cmd, args);
  }
  return result;
}

// The rust regex crate ships with a "regex dna shootout" example, which comes
// with a convenient sample data file. Find it on disk.

let input_file = null;
let cargoMetadata = JSON.parse(runCmd("cargo", ["metadata", "--format-version=1"]).stdout);
for (const pkgMetadata of cargoMetadata.packages) {
  if (pkgMetadata.name === "regex") {
    input_file = path.join(path.dirname(pkgMetadata.manifest_path), 'examples', 'regexdna-input.txt');
    break;
  }
}
if (! input_file || ! fs.existsSync(input_file)) {
  throw new Error("Failed to locate regexdns-input.txt");
}


// Call this like measure(<which>, <count>, <iters>, <length>) to generate <count>
// instances of <which> regexp class, then execute each one <iters> times over the
// first <length> bytes of the test file.
//
// The wall-clock runtime and max RSS for the run will be measured and returned.

function measure(which, count, iters, length="") {
  const bench_case = path.join(__dirname, "bench-case.js");
  const result = runCmd("/usr/bin/time", [
    "-f", '{ "time": %e, "rss": %M }',
    "node", bench_case, which, count, iters, input_file
  ]);
  console.log(JSON.parse(result.stderr));
}

// Let's measure the time and memory usage of creating regexp instances.

//for (let i = 0; i < 50; i++) {
//  measure("builtin", 2 * i, 1);
//  measure("sandboxed", 2 * i, 1);
//  console.log(i);
//}

// Let's measure the actual time taken to test.

for (let i = 0; i < 50; i++) {
  measure("builtin", 1, 100 * i);
  measure("sandboxed", 1, 100 * i);
  console.log(i);
}