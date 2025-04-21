import { describe, expect, test } from "vitest"
import { parseAST } from "../lib/utils/parser";
import { mockEnumImplicitValues } from "./mocks/code-smells-mock";
import { enumImplicitValues } from "../lib/smells/enum-implicit-values";

describe("Enum Implicit Values", () => {
  test("should return an occurrence of Enum Implicit Values", () => {
    const expectedOutput = [
      { start: 3, end: 8 }
    ];

    const ast = parseAST(mockEnumImplicitValues);

    expect(enumImplicitValues(ast)).toEqual(expectedOutput);
  });
});