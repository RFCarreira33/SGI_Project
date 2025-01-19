.PHONY: help
help:
	@echo Targets:
	@echo   install     Install dependencies
	@echo   pdf         Generate PDF
	@echo   runserver   Run local server
	@echo   all         Install dependencies, generate PDF and run local server

.PHONY: install
install:
	npm install

.PHONY: pdf
pdf:
	latexmk -pdf -cd resources/main.tex && \
		latexmk -c -cd resources/main.tex

.PHONY: runserver
runserver:
	npx live-server

.PHONY: all
all: install pdf runserver
