
module.exports = function (ast) {

  // Let's say we just want to count the number of functions involved
  // "ArrowFunctionExpression"
  // "FunctionExpression"

  return {
    numFns: countFns(ast),
  };

};

function countFns (astNode) {
  if (!astNode) {
    console.log('countFns: !astNode');
    return 0;
  }
  else if (astNode.type === "Program"
        || astNode.type === "BlockStatement")
  {
    return astNode.body.map(countFns).reduce((a,b) => a+b, 0);
  }
  else if (astNode.type === "VariableDeclaration") {
    return astNode.declarations.map(countFns).reduce((a,b) => a+b, 0);
  }
  else if (astNode.type === "ArrayExpression") {
    return astNode.elements.map(countFns).reduce((a,b) => a+b, 0);
  }
  else if (astNode.type === "VariableDeclarator") {
    return countFns(astNode.init);
  }
  else if (astNode.type === "BinaryExpression") {
    return countFns(astNode.left) + countFns(astNode.right);
  }
  else if (astNode.type === "MemberExpression") {
    return countFns(astNode.object) + countFns(astNode.property);
  }
  else if (astNode.type === "ExpressionStatement") {
    return countFns(astNode.expression);
  }
  else if (astNode.type === "ReturnStatement") {
    return countFns(astNode.argument);
  }
  else if (astNode.type === "Literal"
        || astNode.type === "Identifier")
  {
    return 0;
  }
  else if (astNode.type === "CallExpression") {
    return countFns(astNode.callee) + astNode.arguments.map(countFns).reduce((a,b) => a+b, 0);
  }
  else if (astNode.type === "FunctionExpression"
        || astNode.type === "ArrowFunctionExpression")
  {
    return 1 + countFns(astNode.body);
  }
  else {
    console.log('countFns: dunno what to do with this astNode:', astNode);
    return 0;
  }
}
