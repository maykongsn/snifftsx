import { describe, expect, test } from "vitest";
import { parseAST } from "../lib/utils/parser";
import { mockAnyType } from "./mocks/code-smells-mock";
import { anyType } from "../lib/smells/any-type";

describe("Any type", () => {
  test("should return three occurrences of Any Type", () => {
    const expectedOutput = [
      { start: 3, end: 3 },
      { start: 4, end: 4 },
      { start: 6, end: 6 }
    ];
    
    const ast = parseAST(mockAnyType);
    
    expect(anyType(ast)).toEqual(expectedOutput);
  });
});