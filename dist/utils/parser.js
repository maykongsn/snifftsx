"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAST = parseAST;
const parser_1 = require("@babel/parser");
function parseAST(file) {
    const ast = (0, parser_1.parse)(file.content, {
        sourceType: "module",
        sourceFilename: file.path,
        plugins: ["jsx", "typescript", "decorators"]
    });
    return ast;
}
