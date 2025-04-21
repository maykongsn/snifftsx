import { ParseResult } from "@babel/parser";
import traverse from "@babel/traverse";
import { File, isBooleanLiteral, isIdentifier, isMemberExpression } from "@babel/types";
import { SourceLocation } from "../types";

export const multipleBooleansForState = (ast: ParseResult<File>) => {
  const states: SourceLocation[] = [];

  traverse(ast, {
    CallExpression(path) {
      const { callee, arguments: args } = path.node;

      const isUseStateCall = 
        (isIdentifier(callee) && callee.name === "useState") ||
        (isMemberExpression(callee) && isIdentifier(callee.property) && callee.property.name === "useState");
      
      if (isUseStateCall && args.length > 0 && isBooleanLiteral(args[0])) {
        states.push({
          start: path.node.callee.loc?.start.line,
          end: path.node.callee.loc?.end.line
        });
      }
    }
  });

  return states.length > 4 ? states : [];
}