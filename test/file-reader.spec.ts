import { describe, expect, test } from "vitest";
import { processFiles } from "../lib/utils/file-reader";
import { mockCode } from "./mocks/tsx-file-mock";

describe.skip("File reader", () => {
  test("should return a list of files with their paths and content", async () => {
    expect(await processFiles("test/components")).toEqual(mockCode);
  });
});