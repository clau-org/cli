import { $, logger } from "../../../../deps.ts";

const validationCode = new Map(
  Object.entries({
    string: "z.string().nullish()",
    "string-required": "z.string()",

    email: "z.string().email().nullish()",
    "email-required": "z.string().email()",

    boolean: "z.boolean().nullish()",
    "boolean-required": "z.boolean()",

    datetime: "z.date().nullish()",
    "datetime-required": "z.date()",

    relation: "z.string().min(12).nullish()",
    "relation-required": "z.string().min(12)",

    uuid: "z.string().uuid().nullish()",
    "uuid-required": "z.string().uuid()",
  }),
);

function getValidationCode({ props }: { props: any[] }) {
  let propsCode = "";

  for (const propConfig of props) {
    const { name, validation: configValidation, type, required } = propConfig;
    const isRelation = type === "relation";

    // Get type key
    const typeKey = `${type}${required ? "-required" : ""}`;

    // Set validation
    const validation = configValidation ?? validationCode.get(typeKey);

    // Set prop name
    const propName = isRelation ? `${name}_id` : name;

    // Create prop code
    const propCode = `${propName}: ${validation},\n`;

    // Add code
    propsCode += propCode;
  }

  return propsCode;
}

function replaceValidationCode({
  validationCode,
  routerCode,
}: {
  validationCode: string;
  routerCode: string;
}) {
  const searchString = "email: z.string().email(),";
  return routerCode.replace(searchString, validationCode);
}

function replaceUserWithName({
  name,
  routerCode,
}: {
  name: string;
  routerCode: string;
}): string {
  const nameFirstUpperCase = name.charAt(0).toUpperCase() + name.slice(1);
  let newRouterCode = routerCode.replace(/user/g, name);
  newRouterCode = newRouterCode.replace(/User/g, nameFirstUpperCase);
  return newRouterCode;
}

async function action(options: any) {
  const { name, apiDir, props } = options;

  // Setup working dir
  const claDirPath = `${apiDir}/.clau`;
  const crudDirPath = `${claDirPath}/add-crud/${name}`;
  const routerPath = `${crudDirPath}/src/routers/users.ts`;
  const newRouterPath = `${apiDir}/src/routers/${name}s.ts`;

  // Clone template create dir
  await $`git clone git@github.com:clau-org/template-add-router-crud.git ${crudDirPath}`;

  // Remove .git folder
  await $`rm -rf ${crudDirPath}/.git`;

  // Read router file
  let routerCode = await Deno.readTextFile(routerPath);

  // Generate validations
  const validationCode = getValidationCode({ props });
  routerCode = replaceValidationCode({ routerCode, validationCode });

  // Replace text
  routerCode = replaceUserWithName({ name, routerCode });

  // Write router file
  const encoder = new TextEncoder();
  const routerCodeData = encoder.encode(routerCode);
  await Deno.writeFile(routerPath, routerCodeData);

  // Copy file
  await Deno.copyFile(routerPath, newRouterPath);

  // Remove .clau folder
  await $`rm -rf ${claDirPath}`;

  // Move to dir
  Deno.chdir(apiDir);

  // Format code
  await $`deno fmt`;

  const message = `
    Router '${name.toUpperCase()}' created.

    # 1. Add missing dependencies if needed
    # 2. Add router to API if needed

    cd ${apiDir} && deno task dev
  `;

  logger.info(message);
}

export { action };
