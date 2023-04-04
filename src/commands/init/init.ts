import { $, Command, logger, Option } from "../../../deps.ts";
import { program } from "../../cli.ts";
import { replaceInFiles } from "./replace.ts";

const command = new Command({
  value: "init",
  description: "Command to scaffold a project",
  action: init,
});

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

async function init() {
  const types = ["ui-layer", "ui-web", "api-module", "api-rest"];
  const usesNpm = ["ui-layer", "ui-web"];
  const usesDeno = ["api-module", "api-rest"];

  const { name, type = "" } = program;

  if (!types.includes(type)) {
    return logger.error("[type is not it types]", {
      types,
    });
  }

  const isNpm = usesNpm.includes(type);
  const isDeno = usesDeno.includes(type);

  const npmMessage = `
    cd ${name}
    npm run dev
  `;

  const denoMessage = `
    Project '${name.toUpperCase()}' created.

    # Change directory to project root
    cd ${name}

    # Run in development mode
    deno task dev
  `;

  logger.info(`Init project '${name}' of type '${type?.toUpperCase()}...'`);

  // Clone template create dir
  await $`git clone git@github.com:clau-org/template-${type}.git ${name}`;

  // Remove .git folder
  await $`rm -rf ${name}/.git`;

  // Replace name in dir
  replaceInFiles({
    searchText: "<NAME>",
    replacementText: name,
    directory: name,
  });

  // Move to dir
  await $`cd ${name}/ `;

  // Install dependencies
  if (isNpm) await $`npm i --force `;

  // Format
  if (isNpm) await $`npm run format `;

  if (isDeno) await $`deno fmt`;

  // Run tests
  if (isNpm) await $`npm run test`;

  if (isDeno) await $`deno task test`;

  // Out of dir
  await $`cd ..`;

  logger.info(`Completed.`);

  if (isNpm) logger.info(npmMessage);

  if (isDeno) logger.info(denoMessage);
}

export { command, options };
