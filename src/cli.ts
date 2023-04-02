import { $, logger } from "../deps.ts";

logger.debug("hello");

await $`echo 5`;
