## Development

Requires a simple web server, npm and latex utils to compile pdf file.

```sh
# Web
npm i 
npx live-server # For example

# Pdf
cd resources/
latexmk -pdf main.tex
```