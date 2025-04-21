import { ParseResult } from "@babel/parser";
import traverse from "@babel/traverse";
import { SourceLocation } from "../types";
import { File, TSType, isTSLiteralType, isTSTypeReference } from "@babel/types";

type UnionMember = string | number | boolean | bigint;

type Union = {
  members: UnionMember[];
} & SourceLocation;

const findTypeNode = (typeNodes: TSType[]) =>
  typeNodes.find((typeNode) =>
    typeNode.type === "TSTypeReference" || typeNode.type === "TSLiteralType"
  )?.loc

const typeLiteralHandler = (typeNode: TSType) =>
  isTSLiteralType(typeNode) && 
  'value' in typeNode.literal 
    ? typeNode.literal.value 
    : defaultHandler(typeNode);

const typeReferenceHandler = (typeNode: TSType): string =>
  isTSTypeReference(typeNode) &&
  'name' in typeNode.typeName 
    ? typeNode.typeName.name 
    : defaultHandler(typeNode);

const defaultHandler = (typeNode: TSType) => typeNode.type;

const handlers: { [key: string]: (typeNode: TSType) => UnionMember } = {
  TSTypeReference: typeReferenceHandler,
  TSLiteralType: typeLiteralHandler,
};

const mapMember = (typeNode: TSType) =>
  (handlers[typeNode.type]?.(typeNode) ?? defaultHandler(typeNode));

export const missingUnionTypeAbstraction = (ast: ParseResult<File>) => {
  const unionTypes: Union[] = [];

  const membersCount: Record<string, number> = {};

  traverse(ast, {
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
    })

    const hasThreeOrMoreDuplicatedUnions = Object.values(membersCount).some(count => count >= 3)

    return hasThreeOrMoreDuplicatedUnions ? unionTypes : [];
  }

  return [];
}