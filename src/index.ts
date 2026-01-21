import { isObjKey, loadRoutes } from "./utils.ts";

const routes = await loadRoutes("./routes");

Deno.serve({ port: 7776 }, async function (req: Request): Promise<Response> {
  const match = routes.find(([url]) => url.exec(req.url));
  if (!match) {
    return new Response("{}", {
      status: 404,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
  }

  const [matchPattern, matchRoute] = match;
  const matchPatternResult = matchPattern.exec(req.url) as URLPatternResult;
  const reqMethod = req.method.toUpperCase();

  if (
    isObjKey(reqMethod, matchRoute) &&
    matchRoute[reqMethod]?.(req, matchPatternResult)
  ) return await matchRoute[reqMethod]?.(req, matchPatternResult);

  return new Response("{}", {
    status: 405,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
});
