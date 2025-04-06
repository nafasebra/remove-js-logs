#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;

const consoleMethods = [
  "assert",
  "clear",
  "count",
  "countReset",
  "debug",
  "dir",
  "dirxml",
  "error",
  "group",
  "groupCollapsed",
  "groupEnd",
  "info",
  "log",
  "table",
  "time",
  "timeEnd",
  "timeLog",
  "timeStamp",
  "trace",
  "warn",
];

function removeConsoleLogsFromFile(filePath) {
  let code = fs.readFileSync(filePath, "utf-8");
  const ast = parser.parse(code, { sourceType: "module", plugins: ["jsx"] });
  const args = process.argv.slice(3);
  const allowedMethods = args.includes("all")
    ? consoleMethods
    : args[0]?.split(",") || ["log"];

  traverse(ast, {
    CallExpression(path) {
      const { callee } = path.node;
      if (
        callee.object?.name === "console" &&
        allowedMethods.includes(callee.property?.name)
      ) {
        path.remove();
      }
    },
  });

  const { code: newCode } = generator(ast, { retainLines: true });
  fs.writeFileSync(filePath, newCode, "utf-8");
}

function processDirectory(dirPath) {
  fs.readdirSync(dirPath).forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (
      [".js", ".ts", ".jsx", ".tsx"].some((ext) => file.endsWith(ext))
    ) {
      removeConsoleLogsFromFile(fullPath);
      console.log(`Processed: ${fullPath}`);
    }
  });
}

const targetDir = process.argv[2] || ".";
processDirectory(targetDir);
console.log("✅ All console.log statements removed!");
