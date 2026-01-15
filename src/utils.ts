import { walkSync } from "@std/fs";
import { relative } from "@std/path";
import { Route } from "./types.ts";
// import { Route } from "./types.ts";

/*
export function getRoutes(dir: string): URLPattern[] {
  const paths = Array.from(
    walkSync(dir, { includeDirs: false }),
    ({ path }) => relative(dir, path),
  );

  return paths
    .filter((path) => path.endsWith(".route.ts"))
    .map((path) =>
      new URLPattern({ pathname: "/" + path.split("/").slice(0, -1).join("/") })
    );
}
*/

export async function getRoutes(dir: string): Promise<[URLPattern, Route][]> {
  let paths = Array.from(
    walkSync(dir, { includeDirs: false }),
    ({ path }) => relative(dir, path),
  );

  const routes: [URLPattern, Route][] = [];

  paths = paths.filter((path) => path.endsWith(".route.ts"));

  for (const path of paths) {
    if (!path.endsWith(".route.ts")) continue;

    const imports = await import(`$routes/${path}`) as object;

    if (!("route" in imports)) {
      throw new Error(`routes/${path} does not provide a route export`);
    }

    if (!(imports.route instanceof Route)) {
      throw new Error(`routes/${path} does not provide a route export`);
    }

    let pathname = path;
    if (path.split("/").at(-1) === "index.route.ts") {
      pathname = pathname.slice(0, -15) + "/";
    } else if (path.endsWith(".route.ts")) pathname = pathname.slice(0, -9);

    routes.push([
      new URLPattern({
        pathname: pathname,
      }),
      imports.route,
    ]);
  }

  return routes;
}

export const randomNumber = (lower: number, upper: number) =>
  Math.floor(Math.random() * (upper - lower + 1)) + lower;

export function getRandomEmoji(): string {
  const emojis = [":)", ":D", ":P", ":3"];
  return emojis[randomNumber(0, emojis.length - 1)];
}

export const returnStatus = (status: number) =>
  new Response(null, { status: status });

export function isObjKey(
  key: string | number | symbol,
  object: object,
): key is keyof object {
  return key in object;
}
