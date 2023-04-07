import { Command, logger, Option } from "../../../deps.ts";
import { program } from "../../cli.ts";
import { action as routerCrudAction } from "./router/crud.ts";

export type SubcommandOptions = {
  value: string;
  types: {
    value: string;
    action: Function;
  }[];
};

export class Subcommand {
  value: string;
  types: {
    value: string;
    action: Function;
  }[];

  constructor({ value, types }: SubcommandOptions) {
    this.value = value;
    this.types = types;
  }
}

const command = new Command({
  value: "add [subcommand]",
  description: "Command to scaffold a project",
  action: add,
});

const isValidSubcommand = ({
  subcommands,
  subcommandId,
}: {
  subcommands: Subcommand[];
  subcommandId: string;
}) => {
  return subcommands.some((subcommand) => subcommand.value === subcommandId);
};

const isValidType = ({
  types,
  typeId,
}: {
  types: { value: string; action: Function }[];
  typeId: string;
}) => {
  return types.some((t) => t.value == typeId);
};

const options: Option[] = [
  new Option({
    flags: "-c | --config",
    description: "Config",
    isRequired: true,
  }),
];

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

async function add() {
  const { subcommand: subcommandId, config: configFilePath } = program;

  const notValidSubcommand = !isValidSubcommand({
    subcommandId,
    subcommands,
  });

  if (notValidSubcommand) {
    return logger.error("[subcommand is not it subcommands]", {
      subcommands: subcommands.map((s) => s.value),
    });
  }

  const currentSubcommand = subcommands.find((s) => s.value == subcommandId);

  // Read config file
  const config = JSON.parse(await Deno.readTextFile(configFilePath));

  // Read type
  const { type: typeId } = config;

  const notValidType = !isValidType({
    types: currentSubcommand!.types,
    typeId,
  });

  if (notValidType) {
    return logger.error("[config error: type is not it types]", {
      types: currentSubcommand!.types.map((t) => t.value),
    });
  }

  const currentType = currentSubcommand!.types.find((t) => t.value == typeId);

  // Execute type action
  await currentType!.action(config);
}

export { command, options };
