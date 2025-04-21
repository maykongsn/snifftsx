import { ParseResult } from "@babel/parser";
import traverse from "@babel/traverse";
import { File } from "@babel/types";
import { SourceLocation } from "../types";

export const enumImplicitValues = (ast: ParseResult<File>) => {
  const enums: SourceLocation[] = [];

  traverse(ast, {
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
}