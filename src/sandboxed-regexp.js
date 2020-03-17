
const path = require('path');
const fs = require('fs');

const wasmBytes = fs.readFileSync(path.join(__dirname, 'sandboxed-regexp_bg.wasm'));
const wasmModule = new WebAssembly.Module(wasmBytes);


class SandboxedRegExp {

  constructor(pattern) {
    this._instance = new WebAssembly.Instance(wasmModule, {});
    this._wasm = this._instance.exports;
    // N.B. the underlying memory object might change after each call into wasm.
    this._memBytes = this._wasm.memory.buffer;
    this._memBuf = Buffer.from(this._memBytes);
    this._wasm.init(...this._passStringToWasm(pattern));
  }

  test(haystack) {
    return !!this._wasm.test(...this._passStringToWasm(haystack));
  }

  _passStringToWasm(value) {
    const len = Buffer.byteLength(value, "utf8");
    const ptr = this._wasm.__wbindgen_malloc(len);
    if (this._memBytes !== this._wasm.memory.buffer) {
      this._memBytes = this._wasm.memory.buffer;
      this._memBuf = Buffer.from(this._memBytes);
    }
    this._memBuf.write(value, ptr, len, "utf8");
    return [ptr, len];
  }
}

module.exports.SandboxedRegExp = SandboxedRegExp;
