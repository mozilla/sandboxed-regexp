# No school like the old school...

build: pkg/sandboxed-regexp.js

pkg/sandboxed-regexp.js: src/lib.rs src/sandboxed-regexp.js Cargo.toml
	# We use a custom smaller-than-normal stack size in the hope of reducing memory usage.
	# This might prove to be a bad idea in practice...
	RUSTFLAGS="-C link-arg=-zstack-size=16384" wasm-pack build --target nodejs --release --out-name="sandboxed-regexp" --no-typescript
	#wasm-pack build --target nodejs --release --out-name="sandboxed-regexp" --no-typescript
	# We have our own custom JS wrapper, overwrite the generated one.
	cp src/sandboxed-regexp.js pkg/sandboxed-regexp.js

test: build
	node ./src/test.js

bench: build
	node ./tools/bench.js

clean:
	rm -rf pkg