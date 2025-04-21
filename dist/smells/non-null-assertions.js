"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nonNullAssertions = void 0;
const traverse_1 = __importDefault(require("@babel/traverse"));
const nonNullAssertions = (ast) => {
    const locations = [];
    (0, traverse_1.default)(ast, {
        TSNonNullExpression(path) {
            locations.push({
                start: path.node.loc?.start.line,
                end: path.node.loc?.end.line
            });
        }
    });
    return locations;
};
exports.nonNullAssertions = nonNullAssertions;
