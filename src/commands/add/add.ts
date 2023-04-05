import { $, Command, logger, Option } from "../../../deps.ts";
import { program } from "../../cli.ts";
import { replaceInFiles } from "../init/replace.ts";

const command = new Command({
  value: "add [arg]",
  description: "Command to scaffold a project",
  action: add,
});

const options: Option[] = [
  new Option({
    flags: "-c | --config",
    description: "Config",
    isRequired: true,
  }),
];

async function add() {
  const args = ["router"];

  const { arg, config } = program;

  const notValidArg = !args.includes(arg);

  if (notValidArg) {
    return logger.error("[arg is not it args]", {
      args,
    });
  }
  //Leer el archivo config
  //Moverte al directorio
  //Descargar archivos
  //Remover .git
  //Cambiar <NAME>
}

export { command, options };
