import { Denomander, logger } from "../deps.ts";
import { addCommands } from "./utils/cli.ts";
import { command as init, options as initOptions } from "./commands/init.ts";

let program = new Denomander({
  app_name: "Clau CLI",
  app_version: "0.0.0",
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
