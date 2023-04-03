import { Denomander, Option, Command, logger } from "../../deps.ts";

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
