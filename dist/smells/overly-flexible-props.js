"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.overlyFlexibleProps = void 0;
const traverse_1 = __importDefault(require("@babel/traverse"));
const types_1 = require("@babel/types");
const usesUnknownRecordType = (node) => {
    return (node.type === "TSTypeReference" &&
        ((0, types_1.isIdentifier)(node.typeName)
            ? node.typeName.name === "Record"
            : (0, types_1.isTSQualifiedName)(node.typeName) &&
                (0, types_1.isIdentifier)(node.typeName.left) &&
                node.typeName.left.name === "Record") &&
        node.typeParameters?.params[0].type === "TSStringKeyword" &&
        node.typeParameters.params[1].type === "TSUnknownKeyword");
};
const isFlexibleElement = (typeAnnotation) => {
    return (typeAnnotation.type === "TSIntersectionType" &&
        typeAnnotation.types.some(usesUnknownRecordType)) || usesUnknownRecordType(typeAnnotation);
};
const nestedTypeAnnotation = (typeAnnotation) => typeAnnotation &&
    'typeAnnotation' in typeAnnotation
    ? typeAnnotation.typeAnnotation
    : null;
const isComponentPropsDefitionFlexible = (param, propsDefinitions) => {
    const typeAnnotation = nestedTypeAnnotation(param?.typeAnnotation);
    return (typeAnnotation?.type === "TSTypeReference" &&
        (((0, types_1.isIdentifier)(typeAnnotation.typeName) &&
            propsDefinitions.includes(typeAnnotation.typeName.name)) ||
            ((0, types_1.isTSQualifiedName)(typeAnnotation.typeName) &&
                propsDefinitions.includes(typeAnnotation.typeName.right.name))));
};
const isComponentInlinePropsFlexible = (param) => {
    const typeAnnotation = nestedTypeAnnotation(param?.typeAnnotation);
    return (typeAnnotation?.type === "TSIntersectionType" &&
        typeAnnotation.types.some((node) => node.type === "TSTypeReference" && isFlexibleElement(node)));
};
const checkComponentPropsUsage = (path, propsDefinitions, components) => {
    if (isComponentPropsDefitionFlexible(path.node.params[0], propsDefinitions) ||
        isComponentInlinePropsFlexible(path.node.params[0])) {
        components.push({
            start: path.node.loc?.start.line,
            end: path.node.loc?.end.line
        });
    }
};
const overlyFlexibleProps = (ast) => {
    const propsDefinitions = [];
    const components = [];
    (0, traverse_1.default)(ast, {
        TSTypeAliasDeclaration(path) {
            if (isFlexibleElement(path.node.typeAnnotation)) {
                propsDefinitions.push(path.node.id.name);
            }
        },
        TSInterfaceDeclaration(path) {
            if (path.node.extends?.some((extend) => extend.expression.type === "Identifier" &&
                extend.expression.name === "Record" &&
                extend.typeParameters?.params[0].type === "TSStringKeyword" &&
                extend.typeParameters?.params[1].type === "TSUnknownKeyword")) {
                propsDefinitions.push(path.node.id.name);
            }
        },
        FunctionDeclaration(path) {
            checkComponentPropsUsage(path, propsDefinitions, components);
        },
        ArrowFunctionExpression(path) {
            checkComponentPropsUsage(path, propsDefinitions, components);
        },
    });
    return components;
};
exports.overlyFlexibleProps = overlyFlexibleProps;
