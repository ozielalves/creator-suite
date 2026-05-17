// Bun's `bun test` uses the native runner (no jsdom). This file delegates to Vitest.
// Prefer: `bun run test`
import { test, expect } from "bun:test";

test("vitest unit suite", async () => {
  const proc = Bun.spawn(["bun", "x", "vitest", "run"], {
    cwd: import.meta.dirname + "/../..",
    stdout: "inherit",
    stderr: "inherit",
  });
  expect(await proc.exited).toBe(0);
});
