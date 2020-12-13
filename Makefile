default: all

all: test run

.PHONY: test
test:
	npm test

.PHONY: run
run: 
	npm start