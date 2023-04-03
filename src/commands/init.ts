import { $, logger, Command, Option } from "../../deps.ts";
import { program } from "../cli.ts";

const options = [
  new Option({
    flags: "-n | --name",
    description: "Name of the project",
    isRequired: true,
  }),
  new Option({
    flags: "-t | --type",
    description: "Type of project",
    isRequired: true,
  }),
];

const command = new Command({
  value: "init",
  description: "Command to scaffold a project",
  action: init,
});

async function init() {
  const types = ["ui-layer", "ui-web", "api-module", "api-rest"];
  const { name, type = "" } = program;

  if (!types.includes(type)) {
    return logger.error("[type is not it types]", {
      types,
    });
  }

  logger.info(`Init project '${name}' of type '${type?.toUpperCase()}...'`);

  // Create dir

  // Copy and paste code

  // Make changes

  // Install dependencies

  // Format

  // Run tests
}

export { command, options };
