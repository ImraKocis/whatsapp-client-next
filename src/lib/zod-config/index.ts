import type { z } from "zod";

const IS_NODE = !!(typeof process === "object" && process?.versions?.node);

function red(text: string): string {
  return `\x1b[31m${text}\x1b[0m`;
}

function yellow(text: string): string {
  return `\x1b[33m${text}\x1b[0m`;
}

function blue(text: string): string {
  return `\x1b[34m${text}\x1b[0m`;
}

function green(text: string): string {
  return `\x1b[32m${text}\x1b[0m`;
}

interface ParseEnvOptions<TSchema extends z.ZodType<object>> {
  schema: TSchema;
  prefix: string;
}

function parseEnv<TSchema extends z.ZodType<object>>({
  schema,
  prefix,
}: ParseEnvOptions<TSchema>): z.infer<TSchema> {
  const prefixStrippedEnv = Object.fromEntries(
    Object.entries(process.env)
      .filter(([key]) => key.startsWith(prefix))
      .map(([key, value]) => [key.slice(prefix.length), value]),
  );

  const result = schema.safeParse(prefixStrippedEnv);
  if (result.success) {
    console.log(`\n${green("Configuration validated!")}\n`);

    return result.data;
  }

  const missingOutput: string[] = [];
  const invalidOutput: string[] = [];

  result.error.issues.forEach((issue) => {
    const environmentVariable = issue.path.join(".");
    if (issue.code === "invalid_type" && issue.message === "Required") {
      missingOutput.push(`  ${blue(prefix + environmentVariable)}`);
    } else {
      invalidOutput.push(
        `  ${blue(prefix + environmentVariable)}: ${issue.message}`,
      );
    }
  });

  let output: string[] = ["", red("Configuration errors!"), ""];
  if (missingOutput.length) {
    missingOutput.unshift(
      `${yellow("Missing")} required environment variables:`,
    );
    output = output.concat(missingOutput.sort());
  }
  if (invalidOutput.length) {
    invalidOutput.unshift(`${yellow("Invalid")} environment variables:`);
    output = output.concat(invalidOutput.sort());
  }

  console.log(output.join("\n"));

  if (IS_NODE) {
    process.exit(1);
  } else {
    throw new Error("Invalid configuration");
  }
}

export { parseEnv };
export type { ParseEnvOptions };
