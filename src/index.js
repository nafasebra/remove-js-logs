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

const args = process.argv.slice(3);
const removeAllLogs = args.includes("all");
const allowedMethods = removeAllLogs
  ? consoleMethods
  : args[0]?.split(",") || ["log"];

function removeConsoleLogsFromFile(filePath) {
  let code = fs.readFileSync(filePath, "utf-8");

  const ast = parser.parse(code, { sourceType: "module", plugins: ["jsx"] });

  traverse(ast, {
    CallExpression(path) {
      if (
        path.node.callee.object?.name === "console" &&
        allowedMethods.includes(path.node.callee.property?.name)
      ) {
        path.remove();
      }
    }
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
      file.endsWith(".js") ||
      file.endsWith(".ts") ||
      file.endsWith(".jsx") ||
      file.endsWith(".tsx")
    ) {
      removeConsoleLogsFromFile(fullPath);
      console.log(`Processed: ${fullPath}`);
    }
  });
}

const targetDir = process.argv[2] || "."; // دریافت دایرکتوری از ورودی
processDirectory(targetDir);
console.log("✅ All console.log statements removed!");
