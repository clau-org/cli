import { Command, Option } from "../../../deps.ts";
import { program } from "../../cli.ts";
import { Subcommand, runSubcommands } from "../../utils/cli.ts";
import { action as routerCrudAction } from "./router/crud.ts";

const subcommands = [
  new Subcommand({
    value: "router",
    types: [
      {
        value: "crud",
        action: routerCrudAction,
      },
    ],
  }),
];

const command = new Command({
  value: "add [subcommand]",
  description: "Command to add to a existing project",
  action: async () => runSubcommands({ program, subcommands }),
});

const options: Option[] = [
  new Option({
    flags: "-c | --config",
    description: "Config",
    isRequired: true,
  }),
];

export { command, options };
