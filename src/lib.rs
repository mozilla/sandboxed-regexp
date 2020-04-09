/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// This is an extremely minimal binding to expose the `regex` crate to wasm.
// It has a global singleton to hold a `regex::Regex` struct, a function for
// initializing it, and a function for testing a string against it.
//
// The intention is that callers will create a whole new instance of the
// resulting wasm module for every new regexp they want to process, so
// that it lives entirely in its own little sandbox.

extern crate wasm_bindgen;

use wasm_bindgen::prelude::*;
use regex::Regex;

use once_cell::sync::OnceCell;

static REGEXP: OnceCell<Regex> = OnceCell::new();

#[wasm_bindgen]
pub fn init(pattern: &str) {
  REGEXP.set(Regex::new(pattern).unwrap()).unwrap();
}

#[wasm_bindgen]
pub fn test(haystack: &str) -> bool {
  let re = REGEXP.get().expect("REGEXP is not initialized");
  re.is_match(haystack)
}
