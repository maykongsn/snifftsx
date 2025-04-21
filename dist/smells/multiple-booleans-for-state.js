"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multipleBooleansForState = void 0;
const traverse_1 = __importDefault(require("@babel/traverse"));
const types_1 = require("@babel/types");
const multipleBooleansForState = (ast) => {
    const states = [];
    (0, traverse_1.default)(ast, {
        CallExpression(path) {
            const { callee, arguments: args } = path.node;
            const isUseStateCall = ((0, types_1.isIdentifier)(callee) && callee.name === "useState") ||
                ((0, types_1.isMemberExpression)(callee) && (0, types_1.isIdentifier)(callee.property) && callee.property.name === "useState");
            if (isUseStateCall && args.length > 0 && (0, types_1.isBooleanLiteral)(args[0])) {
                states.push({
                    start: path.node.callee.loc?.start.line,
                    end: path.node.callee.loc?.end.line
                });
            }
        }
    });
    return states.length > 4 ? states : [];
};
exports.multipleBooleansForState = multipleBooleansForState;
