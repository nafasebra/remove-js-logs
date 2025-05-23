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

// Retrieve command-line arguments (excluding first two default arguments)
const rawArgs = process.argv.slice(3);
// Normalize arguments by removing leading dashes, e.g., "--dry-run" becomes "dry-run"
const args = rawArgs.map(arg => arg.replace(/^--?/, ""));
// Check if dry-run mode is enabled
const dryRun = args.includes("dry-run");
// Check if backup mode is enabled
const backup = args.includes("backup");

function removeConsoleLogsFromFile(filePath) {
  let code = fs.readFileSync(filePath, "utf-8");
  const ast = parser.parse(code, { 
    sourceType: "module", 
    plugins: ["jsx", "typescript"] // Add "typescript" here
  });
  const args = process.argv.slice(3);
  const allowedMethods = args.includes("all")
    ? consoleMethods
    : args[0]?.split(",") || ["log"];

  // Counter for the number of removed console calls in this file
  let removedCount = 0;

  traverse(ast, {
    CallExpression(path) {
      const { callee } = path.node;
      // Check if the call is a console method and if it is allowed to be removed
      if (
        callee.object?.name === "console" &&
        allowedMethods.includes(callee.property?.name)
      ) {
        removedCount++;
        path.remove();
      }
    },
  });

  // If any console calls were removed, generate new code
  if (removedCount > 0) {
    const { code: newCode } = generator(ast, { retainLines: true });
    if (dryRun) {
      // In dry-run mode, just log the changes without modifying the file
      console.log(`[Dry Run] ${filePath} would have removed ${removedCount} console call(s).`);
    } else {
      // If backup flag is enabled, create a backup file before modifying the original file
      if (backup) {
        fs.copyFileSync(filePath, filePath + ".bak");
        console.log(`Backup created for: ${filePath}`);
      }
      fs.writeFileSync(filePath, newCode, "utf-8");
      console.log(`Processed: ${filePath} (removed ${removedCount} console call(s))`);
    }
  }
}

// Recursive function to process all files in the given directory
function processDirectory(dirPath) {
  fs.readdirSync(dirPath).forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (
      [".js", ".ts", ".jsx", ".tsx"].some((ext) => file.endsWith(ext))
    ) {
      removeConsoleLogsFromFile(fullPath);
    }
  });
}

// Get the target directory from command-line arguments (default to current directory)
const targetDir = process.argv[2] || ".";
processDirectory(targetDir);

// Final log message based on mode used
if (dryRun) {
  console.log("✅ Dry run complete! No files were modified.");
} else {
  console.log("✅ All specified console.log statements removed!");
}
