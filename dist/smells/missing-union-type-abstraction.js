"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.missingUnionTypeAbstraction = void 0;
const traverse_1 = __importDefault(require("@babel/traverse"));
const types_1 = require("@babel/types");
const findTypeNode = (typeNodes) => typeNodes.find((typeNode) => typeNode.type === "TSTypeReference" || typeNode.type === "TSLiteralType")?.loc;
const typeLiteralHandler = (typeNode) => (0, types_1.isTSLiteralType)(typeNode) &&
    'value' in typeNode.literal
    ? typeNode.literal.value
    : defaultHandler(typeNode);
const typeReferenceHandler = (typeNode) => (0, types_1.isTSTypeReference)(typeNode) &&
    'name' in typeNode.typeName
    ? typeNode.typeName.name
    : defaultHandler(typeNode);
const defaultHandler = (typeNode) => typeNode.type;
const handlers = {
    TSTypeReference: typeReferenceHandler,
    TSLiteralType: typeLiteralHandler,
};
const mapMember = (typeNode) => (handlers[typeNode.type]?.(typeNode) ?? defaultHandler(typeNode));
const missingUnionTypeAbstraction = (ast) => {
    const unionTypes = [];
    const membersCount = {};
    (0, traverse_1.default)(ast, {
        TSUnionType(path) {
            const loc = findTypeNode(path.node.types);
            unionTypes.push({
                members: path.node.types.map(mapMember),
                start: loc?.start.line,
                end: loc?.end.line
            });
        }
    });
    if (unionTypes.length >= 3) {
        unionTypes.forEach((union) => {
            const normalizedMembers = union.members.sort();
            const key = normalizedMembers.join("|");
            membersCount[key] = (membersCount[key] ?? 0) + 1;
        });
        const hasThreeOrMoreDuplicatedUnions = Object.values(membersCount).some(count => count >= 3);
        return hasThreeOrMoreDuplicatedUnions ? unionTypes : [];
    }
    return [];
};
exports.missingUnionTypeAbstraction = missingUnionTypeAbstraction;
