extern crate wasm_bindgen;

use wasm_bindgen::prelude::*;
use regex::Regex;

#[wasm_bindgen]
pub struct SandboxedRegExp {
  re: Regex,
}

#[wasm_bindgen]
impl SandboxedRegExp {
  pub fn new(pattern: &str) -> Self {
    Self {
      re: Regex::new(pattern).unwrap(),
    }
  }

  pub fn test(&self, haystack: &str) -> bool {
    self.re.is_match(haystack)
  }
}
