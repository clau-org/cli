import { $, Command, logger, Option } from "../../../deps.ts";
import { program } from "../../cli.ts";
import { replaceInFiles } from "../init/replace.ts";
import { action as routerCrudAction } from "./router/crud.ts";

const command = new Command({
  value: "add [type]",
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
  /**
   * clau add router --config clau.json
   * clau add page --config clau.json
   */
  const types = [
    {
      type: "router",
      configTypes: [
        {
          value: "crud",
          action: routerCrudAction,
        },
      ],
    },
  ];

  const isValidType = (type: string) => {
    return types.some((t) => t.type === type);
  };

  const isValidConfigType = ({
    configTypes,
    configType,
  }: {
    configTypes: { value: string; action: Function }[];
    configType: string;
  }) => {
    return configTypes.some((c) => c.value == configType);
  };

  const { type: typeId, config: configFilePath } = program;

  const notValidType = !isValidType(typeId);

  if (notValidType) {
    return logger.error("[type is not it types]", {
      types,
    });
  }

  const currentType = types.find((t) => t.type == typeId);

  let fileConfig: any = null;
  try {
    const jsonString = await Deno.readTextFile(configFilePath);
    fileConfig = JSON.parse(jsonString);
  } catch (error) {
    logger.error(`Failed to read config file: ${error}`);
    return;
  }

  const { type: configType } = fileConfig;

  const notValidRouterConfigType = !isValidConfigType({
    configTypes: currentType!.configTypes,
    configType,
  });

  if (notValidRouterConfigType) {
    return logger.error("[config error: type is not it types]", {
      types: currentType!.configTypes.map((ct) => ct.value),
    });
  }

  const currentConfigType = currentType!.configTypes.find(
    (ct) => ct.value == configType,
  );

  await currentConfigType!.action(fileConfig);
}

export { command, options };
