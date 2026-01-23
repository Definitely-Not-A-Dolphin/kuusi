import { load } from "@std/dotenv";
import { existsSync } from "@std/fs";
import { config } from "../../kuusiApp/kuusi.config.ts";

/**
 * Contains all environment variables, including those in a potential `.env` file.
 */
const env = Deno.env.toObject();
/**
 * Contains all environment variables in a `.env` file.
 */
const dotenv = await load({
  export: true,
  envPath: config.envPath ?? ".env",
});

if (existsSync(".env.template")) {
  const templateEnv = await load({
    export: true,
    envPath: config.envTemplatePath ?? ".env.template",
  });

  const notFound = Object.keys(templateEnv).find((key) => !dotenv[key]);

  if (notFound) {
    throw new Error(`\x1b[34mMissing .env variable ${notFound}\x1b[0m`);
  }
}

export { dotenv, env };
