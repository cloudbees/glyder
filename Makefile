default: test-serve

docs-serve:
	cd docs && node ../glyder.js serve

test-serve:
	cd test_project && node ../glyder.js serve

test-build:
	cd test_project && node ../glyder.js build

test-clean:
	cd test_project && node ../glyder.js clean
