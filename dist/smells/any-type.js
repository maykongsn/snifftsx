"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.anyType = void 0;
const types_1 = require("@babel/types");
const traverse_1 = __importDefault(require("@babel/traverse"));
const anyType = (ast) => {
    const any = [];
    (0, traverse_1.default)(ast, {
        enter(path) {
            if ((0, types_1.isTSAnyKeyword)(path.node)) {
                any.push({
                    start: path.node.loc?.start.line,
                    end: path.node.loc?.end.line,
                    filename: path.node.loc?.filename
                });
            }
        }
    });
    return any;
};
exports.anyType = anyType;
