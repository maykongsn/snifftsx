import { describe, expect, test } from "vitest";
import { parseAST } from "../lib/utils/parser";
import { mockMultipleBooleansForState } from "./mocks/code-smells-mock";
import { multipleBooleansForState } from "../lib/smells/multiple-booleans-for-state";

describe("Multiple Booleans for State", () => {
  test("should return an occurrence of Multiple Booleans for State", () => {
    const expectedOutput = [
      {
        start: 5,
        end: 5
      },
      {
        start: 6,
        end: 6
      },
      {
        start: 7,
        end: 7
      },
      {
        start: 8,
        end: 8
      },
      {
        start: 9,
        end: 9
      },
      {
        start: 10,
        end: 10
      }
    ];

    const ast = parseAST(mockMultipleBooleansForState);

    expect(multipleBooleansForState(ast)).toEqual(expectedOutput);
  });
});