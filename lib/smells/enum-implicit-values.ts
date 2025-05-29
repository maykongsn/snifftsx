import { ParseResult, parse } from "@babel/parser";
import traverse from "@babel/traverse";
import { File } from "@babel/types";
import { SourceLocation } from "../types";
import path from "path";
import fs from "fs";

export const enumImplicitValues = (
  ast: ParseResult<File>,
  filePath: string
): SourceLocation[] => {
  const enums: SourceLocation[] = [];
  const baseDir = path.dirname(filePath);

  traverse(ast, {
    ImportDeclaration(importPath) {
      const importSource = importPath.node.source.value;
      const candidate = path.resolve(baseDir, importSource + ".ts");

      try {
        if (fs.existsSync(candidate)) {
          const content = fs.readFileSync(candidate, "utf-8");
          const importedAST = parse(content, {
            sourceType: "module",
            plugins: ["typescript"]
          });

          traverse(importedAST, {
            TSEnumDeclaration(enumPath) {
              const hasAllMembersWithConstants = enumPath.node.members.every((member) => member.initializer);
              if (!hasAllMembersWithConstants) {
                enums.push({
                  start: enumPath.node.loc?.start.line,
                  end: enumPath.node.loc?.end.line,
                  filename: candidate,
                });
              }
            }
          });
        }
      } catch (e) {
      }
    },
    TSEnumDeclaration(path) {
      const hasAllMembersWithConstants = path.node.members.every((member) => member.initializer);

      if (!hasAllMembersWithConstants) {
        enums.push({
          start: path.node.loc?.start.line,
          end: path.node.loc?.end.line,
        });
      }
    },
  });

  return enums;
};
