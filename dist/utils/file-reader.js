"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readTSXFile = void 0;
exports.readFiles = readFiles;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const isValidPath = async (inputPath) => {
    return await fs_1.promises.stat(inputPath).then(() => true).catch(() => false);
};
const readTSXFile = async (filePath, range) => {
    const content = await fs_1.promises.readFile(filePath, "utf-8");
    if (range) {
        return {
            path: filePath,
            content: content.split("\n").slice(range.startLine - 1, range.endLine).join("\n")
        };
    }
    return { path: filePath, content };
};
exports.readTSXFile = readTSXFile;
const readDirectory = async (dirPath) => {
    const directoryEntries = await fs_1.promises.readdir(dirPath, { withFileTypes: true });
    const filePromises = directoryEntries.map(async (entry) => {
        const fullPath = path_1.default.join(dirPath, entry.name);
        if (entry.isDirectory()) {
            return readDirectory(fullPath);
        }
        if (entry.isFile() && entry.name.endsWith('.tsx')) {
            return (0, exports.readTSXFile)(fullPath);
        }
        return [];
    });
    const files = await Promise.all(filePromises);
    return files.flat();
};
async function readFiles(inputPath) {
    if (!isValidPath(inputPath)) {
        console.log("Please provide a valid directory");
        process.exit(0);
    }
    const stats = await fs_1.promises.stat(inputPath);
    if (stats.isFile() && inputPath.endsWith(".tsx")) {
        return [await (0, exports.readTSXFile)(inputPath)];
    }
    if (stats.isDirectory()) {
        return readDirectory(inputPath);
    }
    console.log("The provided path is neither a valid file or a directory");
    process.exit(0);
}
