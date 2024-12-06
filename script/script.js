const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const middleWareScript = (filePath) => {
  // synchronous version
  try {
    // read the entire main middleware file and return data as the file in text form
    const data = fs.readFileSync(filePath, 'utf8'); // Specify encoding for readable text
    // call findMiddlewareFiles to parse through the text to see if there are additional middleware files within the text
      // somewhere in findMiddlewareFiles we need to keep track of the filePath that the middleware file came from.
    // call getMiddlewareNames on all of the files and aggregate all of the found middleware functions within an array
  } catch (err) {
    console.error('Error reading the file:', err);
  }



// give this function fileText and it will return all middleware functions defined within that file in the form of an array;
  const getMiddlewareNames = (fileText) => {
    const middlewareRegex = /export\s+function\s+(\w+)\s*\(/g;
    let match;
    const middlewareNames = [];
    while ((match = middlewareRegex.exec(fileText)) !== null) {
      middlewareNames.push(match[1]);
    }

    console.log('Middleware Functions:', middlewareNames);
  }

  const findMiddlewareFiles = (fileText) => {
    // grab list of imports from analyzeMiddleware and run it through filters to only leave possible middleware files
    /// filter 1: if middleware is somewhere in the name of the file, pass
    /// filter 2: if the file is in the same directory as the main middleware file, aka in the middlewares folder, pass
    /// etc.
    // return list of filtered imports, should return only middleware files
  }




  // assuming we are given the file path of middleware.ts
  //if no other middleware files are detected, parse through the smaller files to find individual middleware pieces
  // if there are middleware files, now we need to individually parse through the different middleware files to find individual middleware pieces
  // possible ways to discern middleware
  // looking for all instances of "export function [middleware name]"
  // for the case of a larger project with multiple middle ware files, could possibly look for all instances of an import statement which could lead to a smaller middleware file
  // then we look for all instances of "export function [middleware name]"
  // after we have a full list of middlewares we need to check the matcher config to pair up each specific path to the specific middleware its being called on
  // also need logic to handle conditionals within the files
  // output a json of {
  //   middleware n ame:{
  //     child:[
  //   middleware name
  //                       ]
  //                           }
  //                                }



  // Call the function with a file path
  // start at our given filepath (either middleware.ts for all middleware, or a specific middleware file within the middleware folder)
  // from our given filepath
  // if it is middleware.ts (check for the existence of middleware files)
  //// if file path ends with middleware.ts, line 15 conditional is met, jump into the middleware.ts code block
  //// if its named anything else we are not in middleware.ts and can jump into parsing code block
  //if no other middleware files are detected, parse through the smaller files to find individual middleware pieces
  // if there are middleware files, now we need to individually parse through the different middleware files to find individual middleware pieces
  // if its not middleware.ts we can start parsing through the file to find individual middleware pieces
  // possible ways to discern middleware
  // looking for all instances of "export function [middleware name]"
  // for the case of a larger project with multiple middle ware files, could possibly look for all instances of an import statement which could lead to a smaller middleware file
  // then we look for all instances of "export function [middleware name]"
  // after we have a full list of middlewares we need to check the matcher config to pair up each specific path to the specific middleware its being called on
  // also need logic to handle conditionals within the files
};



function analyzeMiddleware(filePath, finalExports = []) {
  const code = fs.readFileSync(filePath, 'utf8');
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['typescript', 'jsx'], // Add 'typescript' for .ts files
  });

  const imports = [];
  const exports = [];

  traverse(ast, {
    ImportDeclaration(path) {
      const importData = {
        source: path.node.source.value,
        specifiers: path.node.specifiers.map((spec) => ({
          imported: spec.imported ? spec.imported.name : 'default',
          local: spec.local.name,
        })),
      };
      imports.push(importData);
    },
    ExportNamedDeclaration(path) {
      if (path.node.declaration) {
        const declaration = path.node.declaration;
        if (declaration.declarations) {
          declaration.declarations.forEach((decl) => {
            exports.push({
              name: decl.id.name,
              file: filePath, // Add the file path
            });
          });
        } else if (declaration.id) {
          exports.push({
            name: declaration.id.name,
            file: filePath, // Add the file path
          });
        }
      } else if (path.node.specifiers) {
        path.node.specifiers.forEach((spec) => {
          exports.push({
            name: spec.exported.name,
            file: filePath, // Add the file path
          });
        });
      }
    },
    ExportDefaultDeclaration(path) {
      exports.push({
        name: 'default',
        file: filePath, // Add the file path
      });
    },
  });
  finalExports.push(...exports);

  // Recursively analyze imports
  imports.forEach((importItem) => {
    // Check if the source is a relative path
    if (importItem.source.includes('.')) {
      // Create the absolute path to the imported middleware
      const absolutePath = path.join(
        __dirname, 
        `../large-testapp/src/app/middlewares/${importItem.source.replace('./', '')}.ts`
      );
  
      console.log('Analyzing middleware at:', absolutePath); // Debugging
  
      // Recursively analyze the middleware
      analyzeMiddleware(absolutePath, finalExports);
    }
  });
  return finalExports;
console.log('imports :>> ', imports);
//   return { imports, exports };
}


// const parse = (moduleExports) => {
  
  
//   `
//   {
//     name: ../large-testapp/src/app/middlewares/mainMiddleware.ts
//     children: [
//       {name: , children:[]}
//       ...
//     ]
//   }
//   `
// }


// function main(filePath) {
//   const resultTree = {
//       name: filePath,
//       children: [],
//   };

//   const traverseMiddleware = (currentFilePath, parentNode) => {
//       const analysisResult = analyzeMiddleware(currentFilePath);

//       if (analysisResult && analysisResult.imports.length > 0) {
//           for (const importItem of analysisResult.imports) {
//               // Resolve the next file path
//               const nextFilePath = path.resolve(path.dirname(currentFilePath), importItem.source);

//               // Create a new child node
//               const childNode = {
//                   name: nextFilePath,
//                   children: [],
//               };

//               // Add the child node to the parent
//               parentNode.children.push(childNode);

//               // Recursively traverse the next file
//               traverseMiddleware(nextFilePath, childNode);
//           }
//       }
//   };

  // Start traversing from the given file path
  const filePath = path.join(__dirname, '../large-testapp/src/app/middlewares/mainMiddleware.ts');
  const filePathSmall = path.join(__dirname, '../testapp/src/app/middleware.ts');
  console.log(analyzeMiddleware(filePathSmall));
  console.log(analyzeMiddleware(filePath));
  //   // Output the final tree
//   console.log(JSON.stringify(resultTree, null, 2));
// }

  // console.log('Imports:', result.imports);
  // console.log('Imports specifiers:', result.imports.specifiers);
  // console.log('Exports:', result.exports);

// console.log("MAIN", main('../large-testapp/src/app/middlewares/mainMiddleware.ts'));