import { Command, Denomander, Option, logger } from "../../deps.ts";

export function addCommand({
  command,
  program: _program,
  options,
}: {
  command: Command;
  program: Denomander;
  options: Option[];
}) {
  let program = _program
    .command(command.value)
    .description(command.description);

  options.forEach((option) => {
    if (option._isRequired) {
      program = program.requiredOption(option._flags, option._description);
    } else {
      program = program.option(option._flags, option._description);
    }
  });

  return program.action(command.action);
}

export function addCommands({
  commands,
  program,
}: {
  commands: {
    command: Command;
    options: Option[];
  }[];
  program: Denomander;
}) {
  commands.forEach(({ command, options }) => {
    program = addCommand({ program, command, options });
  });

  return program;
}

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

export const isValidSubcommand = ({
  subcommands,
  subcommandId,
}: {
  subcommands: Subcommand[];
  subcommandId: string;
}) => {
  return subcommands.some((subcommand) => subcommand.value === subcommandId);
};

export const isValidType = ({
  types,
  typeId,
}: {
  types: { value: string; action: Function }[];
  typeId: string;
}) => {
  return types.some((t) => t.value == typeId);
};

export async function runSubcommands({
  subcommands,
  program,
}: {
  subcommands: Subcommand[];
  program: Denomander;
}) {
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
