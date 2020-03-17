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
