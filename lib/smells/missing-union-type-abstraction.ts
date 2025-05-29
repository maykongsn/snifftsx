import { ParseResult } from "@babel/parser";
import traverse from "@babel/traverse";
import { SourceLocation } from "../types";
import { 
  File,
  TSType,
  isTSLiteralType,
  isTSTypeReference,
  isTSNullKeyword,
  isTSUndefinedKeyword,
  isTSBooleanKeyword,
  isTSNumberKeyword,
  isTSStringKeyword,
} from "@babel/types";

type UnionMember = string | number | boolean | bigint;

type Union = {
  members: UnionMember[];
} & SourceLocation;

const findTypeNode = (typeNodes: TSType[]) =>
  typeNodes.find((typeNode) =>
    typeNode.type === "TSTypeReference" || typeNode.type === "TSLiteralType"
  )?.loc;

const typeLiteralHandler = (typeNode: TSType) =>
  isTSLiteralType(typeNode) && "value" in typeNode.literal
    ? typeNode.literal.value
    : defaultHandler(typeNode);

const typeReferenceHandler = (typeNode: TSType): string =>
  isTSTypeReference(typeNode) && "name" in typeNode.typeName
    ? typeNode.typeName.name
    : defaultHandler(typeNode);

const defaultHandler = (typeNode: TSType) => typeNode.type;

const handlers: { [key: string]: (typeNode: TSType) => UnionMember } = {
  TSTypeReference: typeReferenceHandler,
  TSLiteralType: typeLiteralHandler,
};

const mapMember = (typeNode: TSType) =>
  handlers[typeNode.type]?.(typeNode) ?? defaultHandler(typeNode);

const isPrimitive = (typeNode: TSType) =>
  isTSStringKeyword(typeNode) ||
  isTSNumberKeyword(typeNode) ||
  isTSBooleanKeyword(typeNode) ||
  isTSNullKeyword(typeNode) ||
  isTSUndefinedKeyword(typeNode);

const hasLiteralType = (types: TSType[]) =>
  types.some((t) => isTSLiteralType(t));

const allArePrimitive = (types: TSType[]) =>
  types.every((t) => isPrimitive(t));

export const missingUnionTypeAbstraction = (ast: ParseResult<File>) => {
  const unionTypes: Union[] = [];

  const membersCount: Record<string, number> = {};
  const typeInfo: Record<string, { hasLiteral: boolean; allPrimitive: boolean }> = {};

  traverse(ast, {
    TSUnionType(path) {
      const { types } = path.node;

      const loc = findTypeNode(types);
      const members = types.map(mapMember);
      const normalized = members.slice().sort();
      const key = normalized.join("|");

      const allPrimitive = allArePrimitive(types);
      const hasLiteral = hasLiteralType(types);

      typeInfo[key] = { hasLiteral, allPrimitive };

      unionTypes.push({
        members,
        start: loc?.start.line,
        end: loc?.end.line,
      });

      membersCount[key] = (membersCount[key] ?? 0) + 1;
    },
  });

  const filtered = unionTypes.filter((union) => {
    const key = union.members.slice().sort().join("|");
    const { hasLiteral, allPrimitive } = typeInfo[key];
    const count = membersCount[key];

    if (hasLiteral) {
      return count >= 3;
    }

    if (allPrimitive) {
      return count >= 5;
    }

    return false;
  });

  return filtered;
};