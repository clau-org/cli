import { assertEquals } from "../deps_tests.ts";
import { hello } from "../src/hello.ts";

Deno.test("Empty test", async () => {
  const helloResult = hello();

  assertEquals(helloResult, "Hello from <NAME>");
});
