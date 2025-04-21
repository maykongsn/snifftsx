"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enumImplicitValues = void 0;
const traverse_1 = __importDefault(require("@babel/traverse"));
const enumImplicitValues = (ast) => {
    const enums = [];
    (0, traverse_1.default)(ast, {
        TSEnumDeclaration(path) {
            const hasAllMembersWithConstants = path.node.members.every((member) => member.initializer);
            if (!hasAllMembersWithConstants) {
                enums.push({
                    start: path.node.loc?.start.line,
                    end: path.node.loc?.end.line,
                });
            }
        }
    });
    return enums;
};
exports.enumImplicitValues = enumImplicitValues;
