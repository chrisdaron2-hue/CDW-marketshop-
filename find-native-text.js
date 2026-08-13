const fs = require("fs");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

const source = fs.readFileSync("App.js", "utf8");

const ast = parser.parse(source, {
  sourceType: "module",
  plugins: ["jsx", "flow"],
});

function getTagName(node) {
  if (!node) return "Unknown";
  if (node.type === "JSXIdentifier") return node.name;
  return "Unknown";
}

function isDefinitelyBoolean(node) {
  if (!node) return false;

  if (node.type === "BooleanLiteral") return true;

  if (node.type === "UnaryExpression" && node.operator === "!") {
    return true;
  }

  if (
    node.type === "BinaryExpression" &&
    ["==", "===", "!=", "!==", ">", ">=", "<", "<="].includes(
      node.operator
    )
  ) {
    return true;
  }

  if (
    node.type === "CallExpression" &&
    node.callee?.type === "Identifier" &&
    node.callee.name === "Boolean"
  ) {
    return true;
  }

  return false;
}

function expressionMayRenderText(node) {
  if (!node) return false;

  if (
    [
      "StringLiteral",
      "NumericLiteral",
      "TemplateLiteral",
      "Identifier",
      "MemberExpression",
      "OptionalMemberExpression",
    ].includes(node.type)
  ) {
    return true;
  }

  if (node.type === "CallExpression") {
    const property = node.callee?.property?.name;

    // map() normally returns React elements in this project.
    if (property === "map") return false;

    return true;
  }

  if (node.type === "LogicalExpression") {
    if (!isDefinitelyBoolean(node.left)) {
      return true;
    }

    return expressionMayRenderText(node.right);
  }

  if (node.type === "ConditionalExpression") {
    return (
      expressionMayRenderText(node.consequent) ||
      expressionMayRenderText(node.alternate)
    );
  }

  if (node.type === "BinaryExpression") {
    return !isDefinitelyBoolean(node);
  }

  if (node.type === "ArrayExpression") {
    return true;
  }

  return false;
}

traverse(ast, {
  JSXText(path) {
    const value = path.node.value.replace(/\s+/g, " ").trim();
    if (!value) return;

    const parentElement = path.findParent((parent) =>
      parent.isJSXElement()
    );

    if (!parentElement) return;

    const tag = getTagName(parentElement.node.openingElement.name);

    if (tag !== "Text") {
      console.log(
        `App.js:${path.node.loc.start.line} raw text inside <${tag}>: ${JSON.stringify(value)}`
      );
    }
  },

  JSXExpressionContainer(path) {
    if (path.parentPath.isJSXAttribute()) return;

    const parentElement = path.findParent((parent) =>
      parent.isJSXElement()
    );

    if (!parentElement) return;

    const tag = getTagName(parentElement.node.openingElement.name);

    if (
      tag !== "Text" &&
      tag !== "TextInput" &&
      expressionMayRenderText(path.node.expression)
    ) {
      const code = source
        .slice(path.node.start, path.node.end)
        .replace(/\s+/g, " ")
        .slice(0, 180);

      console.log(
        `App.js:${path.node.loc.start.line} possible text inside <${tag}>: ${code}`
      );
    }
  },
});
