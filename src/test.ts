import { loadRoutes } from "./utils.ts";

const routes = await loadRoutes("./routes");
console.log(routes);
