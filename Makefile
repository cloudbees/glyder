default: serve

serve:
	node src/glyder.js serve test_project/src test_project/build

build:
	node src/glyder.js build test_project/src test_project/build

clean:
	node src/glyder.js clean test_project/src test_project/build
