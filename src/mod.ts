import { walkSync } from "@std/fs";
import { relative } from "@std/path";
import { config } from "../../kuusiApp/kuusi.config.ts";
import { Route } from "./types.ts";
import { isObjKey, unwrap } from "./utils.ts";

export * from "./env.ts";
export * from "./types.ts";

const routeDir = config.routeDir ?? "routes";

const paths = Array.from(
  walkSync(routeDir, { includeDirs: false }),
  ({ path }) => relative(routeDir, path),
);

const routes: [URLPattern, Route][] = [];

for (const path of paths) {
  if (!path.endsWith(".route.ts")) continue;

  const imports = await import(
    `${import.meta.dirname}/../${routeDir}/${path}`
  ) as object;

  if (!("route" in imports)) {
    throw new Error(`routes/${path} does not provide a route export`);
  }

  if (!(imports.route instanceof Route)) {
    throw new Error(`routes/${path} does not provide a valid route export`);
  }

  let pathname = ("/" + path).slice(
    0,
    path.split("/").at(-1) === "index.route.ts"
      ? -("index.route.ts".length + 1)
      : -".route.ts".length,
  );

  if (pathname === "") pathname = "/";

  routes.push([
    new URLPattern({ pathname: pathname }),
    imports.route,
  ]);
}

export async function kuusi(req: Request): Promise<Response> {
  const match = routes.find(([url]) => url.test(req.url));

  if (!match) {
    return new Response("{}", {
      status: 404,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
  }

  const [matchPattern, matchRoute] = match;
  const matchPatternResult = unwrap(matchPattern.exec(req.url));

  if (isObjKey(req.method, matchRoute)) {
    const matchMethod = unwrap(matchRoute[req.method]);
    return await matchMethod(req, matchPatternResult);
  }

  return new Response("{}", {
    status: 405,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
}
