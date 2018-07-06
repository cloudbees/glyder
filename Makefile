default: serve

serve:
	npx -c 'babel-node src/glyder.js serve test_project/src test_project/build'

build:
	npx -c 'babel-node src/glyder.js build test_project/src test_project/build'

clean:
	npx -c 'babel-node src/glyder.js clean test_project/src test_project/build'

dist:
	babel
