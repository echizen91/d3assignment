default: all

all: clean install run

.PHONY: clean
clean:
	rm -rf node_modules/

.PHONY: install
install:
	npm install

.PHONY: test
test:
	npm test

.PHONY: run
run: 
	npm start