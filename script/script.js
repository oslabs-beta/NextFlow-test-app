const fs = require('fs');
const path = require('path');
const readline = require('readline');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const pairPathWithMiddleware = (fileObject) => {
  return new Promise((resolve, reject) => {
    if (!fileObject.path) {
      fileObject.path = new Set();
    }
    const readStream = fs.createReadStream(fileObject.file);
    const rl = readline.createInterface({
      input: readStream,
      crlfDelay: Infinity,
    });
    let inFunction = false;

    rl.on('line', (line) => {
      const cleanLine = line.trim();
      // Create a regex pattern to look for 'export function' followed by fileObject.name
      const regex = new RegExp(
        `\\bexport\\s+function\\s+${fileObject.name}\\b`
      );

      const secondRegex = new RegExp(`\\bexport\\b`);

      // Check if the line matches the pattern

      if(secondRegex.test(cleanLine) && inFunction){
        // We found another 'export function', so toggle off inFunction
        inFunction = false;
        console.log('Exited function due to another export function:', cleanLine);
      }
      
        if (regex.test(cleanLine)) {
          if (!inFunction) {
            // We're entering a new function
            inFunction = true;
            console.log('Entered function:', cleanLine);
          }
        }
    

      if(inFunction){
        console.log('cleanLine :>> ', cleanLine);
        const noCommentsText = cleanLine
        .replace(/\/\/.*$/gm, '') // Remove single-line comments
        .replace(/\/\*[\s\S]*?\*\//g, ''); // Remove multi-line comments
        
        if (
          noCommentsText.trim().startsWith('import') ||
          noCommentsText.trim().startsWith('require')
        ) {
          return; // Skip this line
        }
        
        // console.log('No comments text:', noCommentsText);

        const pathRegex = /\/[a-zA-Z0-9-_\/\.?=&]+/g;
        const matches = noCommentsText.match(pathRegex);

        if (matches) {
          matches.forEach((match) => {
            fileObject.path.add(match);
            console.log('fileObject :>> ', fileObject);
          });
        }

  
      }
    });

    rl.on('close', () => {
      console.log('Final fileObject paths:', Array.from(fileObject.path));
      resolve(); // Resolve the promise after processing is done
    });

    rl.on('error', (error) => {
      reject(error); // Reject the promise if there's an error
    });
  });
};

// const getPathNames = (filePath) => {
//   const innerFileText = fs.readFileSync(filePath, 'utf8');

//   // Remove single-line comments and multi-line comments
//   const noCommentsText = innerFileText
//     .replace(/\/\/.*$/gm, '') // Remove single-line comments
//     .replace(/\/\*[\s\S]*?\*\//g, ''); // Remove multi-line comments

//   // Split the content into lines
//   const lines = noCommentsText.split('\n');

//   // Filter out lines that start with 'import' or 'require' (for imports)
//   const filteredLines = lines.filter(line => !line.trim().startsWith('import') && !line.trim().startsWith('require'));

//   // Define a regex to match paths starting with '/' but exclude those with 'import' or 'require'
//   const pathRegex = /(?<!import\s+['"]|require\(['"])\/[a-zA-Z0-9-_\/]+/g;

//   // Create a Set to store unique paths
//   const uniquePaths = new Set();

//   // Iterate through each line and find matches
//   filteredLines.forEach(line => {
//     const pathMatches = line.match(pathRegex);

//     if (pathMatches) {
//       pathMatches.forEach(path => {
//         uniquePaths.add(path); // Store path directly in the Set
//       });
//     }
//   });

//   // Return the Set as an array
//   return Array.from(uniquePaths);
// };

// const analyzeFilePaths = (finalExports) => {
//   const checkedPaths = new Set();
//   finalExports.forEach((file) => {
//     if (file.name !== 'config') {
//       checkedPaths.add(file);
//     }
//   });
//   checkedPaths.forEach((path) => {
//     // go inside file, create path array for it and if its name key is config, delete it
//     // console.log('path being used :>> ', path);
//     pairPathWithMiddleware(path);
//     //  console.log('path :>> ', path);
//   });
// };

const analyzeMiddleware = async (filePath, finalExports = []) => {
  try {
    const code = fs.readFileSync(filePath, 'utf8');
    const ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx'],
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
                file: filePath,
              });
            });
          } else if (declaration.id) {
            exports.push({
              name: declaration.id.name,
              file: filePath,
            });
          }
        } else if (path.node.specifiers) {
          path.node.specifiers.forEach((spec) => {
            exports.push({
              name: spec.exported.name,
              file: filePath,
            });
          });
        }
      },
      ExportDefaultDeclaration(path) {
        exports.push({
          name: 'default',
          file: filePath,
        });
      },
    });

    finalExports.push(...exports);

    // Recursively analyze imports
    for (const importItem of imports) {
      if (importItem.source.includes('.')) {
        const absolutePath = path.join(
          __dirname,
          `../large-testapp/src/app/middlewares/${importItem.source.replace(
            './',
            ''
          )}.ts`
        );

        await analyzeMiddleware(absolutePath, finalExports); // Await recursive call
      }
    }

    // Ensure paths are updated for each file

    const filteredExports = finalExports.filter(
      (file) => file.name !== 'config'
    );

    for (const file of filteredExports) {
      await pairPathWithMiddleware(file); // Await pairPathWithMiddleware for each file
    }

    console.log('finalExports :>> ', filteredExports);
    return filteredExports;
  } catch (error) {
    console.log(error);
  }
};

// Start traversing from the given file path
// const filePathSmall = path.join(__dirname, '../testapp/src/app/middleware.ts');
// console.log(analyzeMiddleware(filePathSmall));
const filePath = path.join(
  __dirname,
  '../large-testapp/src/app/middlewares/mainMiddleware.ts'
);
console.log(analyzeMiddleware(filePath));
