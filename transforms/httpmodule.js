const transform = (fileInfo, api, options) => {
  const j = api.jscodeshift;

  const convertImport = (module) => (p) => {
    const modifiedNode = p.node;
    modifiedNode.specifiers[0] = j.importSpecifier(
      j.identifier(module)
    );

    modifiedNode.source = j.stringLiteral('@angular/common/http')
    return modifiedNode;
  };

  const removeMapToJson = (p) => {
    return p.node.callee.object;
  };

  const convertImportHttpModule = convertImport('HttpClientModule');
  const convertImportHttp = convertImport('HttpClient');

  const originalAst = j(fileInfo.source);

  const afterReplacingModuleImports = originalAst
    .find(j.ImportDeclaration, {
      specifiers: [{
        type: "ImportSpecifier",
        imported: {
          name: "HttpModule"
        }
      }],
      source: {
        value: "@angular/http"
      }
    })
    .replaceWith(convertImportHttpModule)
    .toSource();

  const afterReplacingHttpImports = j(afterReplacingModuleImports)
    .find(j.ImportDeclaration, {
      specifiers: [{
        type: "ImportSpecifier",
        imported: {
          name: "Http"
        }
      }],
      source: {
        value: "@angular/http"
      }
    })
    .replaceWith(convertImportHttp)
    .toSource();


  const afterReplacingJsonMappings = j(afterReplacingHttpImports)
    .find(j.CallExpression, {
      callee: {
        type: "MemberExpression",
        object: {
          type: "CallExpression",
          callee: {
            type: "MemberExpression",
            object: {
              type: "MemberExpression",
              property: {
                type: "Identifier",
                name: "http"
              }
            }
          }
        },
        property: {
          type: "Identifier",
          name: "map"
        }
      }
    })
    .replaceWith(removeMapToJson)
    .toSource();

  return afterReplacingJsonMappings;
};

module.exports = transform;
