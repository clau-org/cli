import { Denomander, logger } from "../deps.ts";
import { addCommands } from "./utils/cli.ts";
import * as denojson from "../deno.json" assert { type: "json" };
import {
  command as init,
  options as initOptions,
} from "./commands/init/init.ts";

const { name, version, description } = denojson.default;

let program = new Denomander({
  app_name: name,
  app_version: version,
  app_description: description,
});

const commands = [
  {
    command: init,
    options: initOptions,
  },
];

program = addCommands({ program, commands });

try {
  program.parse(Deno.args);
} catch (error) {
  logger.error({ error });
}

export { program };
