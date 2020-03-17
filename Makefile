# No school like the old school...

build: pkg/sandboxed-regexp.js

pkg/sandboxed-regexp.js: src/lib.rs src/sandboxed-regexp.js Cargo.toml
	wasm-pack build --target nodejs --release --out-name="sandboxed-regexp" --no-typescript
	# We have our own custom JS wrapper, overwiting the generated one.
	cp src/sandboxed-regexp.js pkg/sandboxed-regexp.js
