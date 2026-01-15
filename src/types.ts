type RouteMethod = (req: Request) => Promise<Response> | Response;

export interface RouteMethods {
  GET?: RouteMethod;
  POST?: RouteMethod;
  PUT?: RouteMethod;
  DELETE?: RouteMethod;
}

export class Route implements RouteMethods {
  readonly GET?: RouteMethod;
  readonly POST?: RouteMethod;
  readonly PUT?: RouteMethod;
  readonly DELETE?: RouteMethod;

  constructor(obj: RouteMethods) {
    Object.assign(this, obj);
  }
}

export const routeGuard = (object: object) => object instanceof Route;
