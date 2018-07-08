default: serve

serve:
	node glyder/index.js serve test_project/src test_project/build

build:
	node glyder/index.js build test_project/src test_project/build

clean:
	node glyder/index.js clean test_project/src test_project/build
