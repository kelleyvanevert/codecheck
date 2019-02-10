
/*
  Usage:
  - node tool.js -f analyze.js
  - node tool.js "let x = 6;"
*/

const fs = require("fs");
const { parseScript } = require("esprima");
const { summarize, countTypes } = require("./analyze.js");
const argv = require("minimist")(process.argv.slice(2));

let sourceCode;

if (argv.f) {
  sourceCode = fs.readFileSync(argv.f, "utf-8");
} else {
  sourceCode = argv["_"][0];
}

console.log("counting:", Object.keys(countTypes))
console.log(summarize(parseScript(sourceCode)));
