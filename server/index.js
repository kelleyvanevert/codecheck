
// for dynamic analysis
const SandCastle = require('sandcastle').SandCastle;

// for static analysis
const esprima = require('esprima');
const performStaticAnalysis = require("./perform-static-analysis.js");

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
    ast = esprima.parse(sourceCode);
  } catch (e) {
    // error parsing the code
    res.json({
      err_parse: true,
      err: "could not parse"
    });
    return;
  }

  const sandcastle = new SandCastle();
  const script = sandcastle.createScript(`
    exports.main = function () {
      ${sourceCode};
      if (typeof some_variable === 'undefined') {
        exit({ undef: true });
      } else {
        exit({ value: some_variable });
      }
    };
  `);

  script.on("exit", function(err, output) {
    res.json({
      err,
      output,
      ast,
      staticAnalysis: performStaticAnalysis(ast),
    })
  });

  script.run({});
});

app.listen(3000);
