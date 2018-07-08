default: test-serve

test-serve:
	node glyder serve test_project/src test_project/build

test-build:
	node glyder build test_project/src test_project/build

test-clean:
	node glyder clean test_project/src test_project/build
