
# 🧹 remove-js-logs

**remove-js-logs** is a lightweight CLI tool to automatically remove all `console.log` statements from JavaScript and TypeScript files in your project.  
Perfect for cleaning up your codebase before production deployment.

---

![npm version](https://img.shields.io/npm/v/remove-js-logs.svg)
![npm downloads](https://img.shields.io/npm/dm/remove-js-logs.svg)
![license](https://img.shields.io/npm/l/remove-js-logs.svg)

---

## 📦 Installation

### Install globally:

You can run this tool as globaly:

```bash
npm install -g remove-js-logs
```


## ⚙️ Usage

Pass specific path and run this:

```bash
remove-logs [path]
```

For examples:

```bash
remove-js-logs .             # Remove logs from all files recursively
remove-js-logs ./src         # Clean a specific folder
```

You can also specify which console methods to remove by passing them as a comma-separated list:

```bash
npx remove-js-logs . info,log    # Remove console.info() and console.log() calls
npx remove-js-logs . all         # Remove all console methods (log, warn, error, etc.)
```

## ✅ Features

- ✅ Removes specific console methods (by default removes `console.log()`)
- ✅ Supports `.js`, `.ts`, `.jsx`, and `.tsx` files
- ✅ Recursive directory scan
- ✅ Ignores node_modules, .git, dist, build, etc.
- ✅ Fast, clean CLI with colored output and loading indicators

## 🔍 What Gets Removed

By default, only `console.log()` calls will be removed:

```js
console.log("Debug info");
console.log(user);
```

If specified, the following methods will also be removed:

```js
console.warn("Warning!");
console.error("An error occurred");
console.info("Information");
```

## 🛠 Development
To run and test locally:

```
git clone https://github.com/nafasebra/remove-js-logs.git
cd remove-js-logs
npm install
npm link
```

This allows you to use it globally during development:

```bash
remove-js-logs .
```

To unlink:

```bash
npm unlink
```

## 💬 Feedback & Contributions

Feel free to open issues or submit pull requests.
Suggestions and contributions are always welcome!

## 🧾 License

MIT © [Nafas Ebrahimi](LICENSE)
