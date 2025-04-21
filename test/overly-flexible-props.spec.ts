import { describe, expect, test } from "vitest";
import { parseAST } from "../lib/utils/parser";
import { mockOverlyFlexibleProps } from "./mocks/code-smells-mock";
import { overlyFlexibleProps } from "../lib/smells/overly-flexible-props";

describe("Overly Flexible Props", () => {
  test("should return three occurrences of Overly Flexible Props", () => {
    const expectedOutput = [
      { start: 9, end: 16 },
      {
        start: 18,
        end: 18
      },
      {
        start: 20,
        end: 20
      }
    ];

    const ast = parseAST(mockOverlyFlexibleProps);

    expect(overlyFlexibleProps(ast)).toEqual(expectedOutput);
  });
});