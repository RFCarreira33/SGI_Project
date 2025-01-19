## Requisites

- Npm
- Latex Utils (latexmk)
- Make (optional)

## Development

Use `make help` to see options or:

```sh
# Web
npm i 
npx live-server

# Pdf
latexmk -pdf -cd resources/main.tex
```