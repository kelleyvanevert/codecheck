
const fs = require("fs");

// for dynamic analysis
const SandCastle = require('sandcastle').SandCastle;

// for static analysis
const { parseScript } = require("esprima");
const { summarize } = require("../lib/analyze.js");

// for the server itself
const express = require('express');
const app = module.exports = express();
const cors = require('cors')
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send("hello");
});

app.post('/', (req, res) => {
  const { sourceCode } = req.body;

  let ast;
  try {
    ast = parseScript(sourceCode);
  } catch (e) {
    // error parsing the code
    res.json({
      err_parse: true,
      err: "could not parse"
    });
    return;
  }

  let staticAnalysis = summarize(ast);

  const sandcastle = new SandCastle();
  const script = sandcastle.createScript(`
    exports.main = function () {
      ${sourceCode};
      const __static_analysis = ${JSON.stringify(staticAnalysis)};
      ${fs.readFileSync("./exercises/avg_with_reduce.js", "utf-8")};
    };
  `);

  script.on("exit", (err, output) => {
    console.log("complete run", err ? err.message : 'no error', output)
    res.json({
      err: err ? err.message : undefined,
      passed_tests: !err,
      ast,
      staticAnalysis,
    })
  });

  script.run({});
});

app.listen(3000);
