# httpmodule-codemod

Codemod para portar projetos Angular de `Http` para `HttpClient`.

Status: experimental

## Como usar

```bash
$ npm install -g jscodeshift
$ jscodeshift -t https://raw.githubusercontent.com/thiagoarrais/httpmodule-codemod/master/transforms/httpmodule.js
  --extensions=ts \
  --parser=ts \
  meu-projeto-angular/
```
