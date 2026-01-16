import { getRoutes, isObjKey, returnStatus } from "./utils.ts";

const routes = await getRoutes("./routes");

console.log(routes);

async function handler(req: Request): Promise<Response> {
  let parsedURL = req.url;
  if (!parsedURL.endsWith("/")) parsedURL += "/";

  console.log(parsedURL);

  const match = routes.find(([url]) => url.exec(req.url));
  console.log(match);
  if (!match) return returnStatus(404);

  const [_, matchRoute] = match;

  const thing = req.method.toUpperCase() ?? "GET";

  if (isObjKey(thing, matchRoute) && matchRoute[thing]?.(req)) {
    return await matchRoute[thing]?.(req);
  }

  return returnStatus(405);
}

Deno.serve({ port: 7776 }, handler);
