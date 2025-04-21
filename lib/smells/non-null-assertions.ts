import { ParseResult } from "@babel/parser";
import { File } from "@babel/types";
import traverse from "@babel/traverse";
import { SourceLocation } from "../types";

export const nonNullAssertions = (ast: ParseResult<File>) => {
  const locations: SourceLocation[] = [];

  traverse(ast, {
    TSNonNullExpression(path) {
      locations.push({
        start: path.node.loc?.start.line,
        end: path.node.loc?.end.line
      });
    }
  });

  return locations;
}