const fs = require('fs');

const middleWareScript = (filePath) => {
  // synchronous version
  try {
    const data = fs.readFileSync(filePath, 'utf8'); // Specify encoding for readable text
    console.log(data);
    return data;
  } catch (err) {
    console.error('Error reading the file:', err);
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
  //   middleware name:{
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

const filePath = '../testapp/src/app/middleware.ts';
middleWareScript(filePath);
