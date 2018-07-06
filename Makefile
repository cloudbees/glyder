default: run

run:
	npx -c 'babel-node src/glyder.js -- serve test_project/src test_project/build'

dist:
	babel
