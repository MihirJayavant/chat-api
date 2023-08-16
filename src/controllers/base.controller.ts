// deno-lint-ignore-file no-explicit-any
import {
  httpCodes,
  internalServerErrorResponse,
  IResult,
} from "/configs/api.config.ts";
import { logger } from "/utilities/logger.ts";
import { ResponseBody, Router, RouterContext } from "/deps.ts";

type MiddlewareFn = (ctx: RouterContext<any>) => Promise<void>;
type ControllerResponse<TResult> = IResult<TResult> | Promise<IResult<TResult>>;
type fn<T> = (context: RouterContext<any>) => ControllerResponse<T>;

export function baseController<T>(controller: fn<T>) {
  return async (ctx: RouterContext<any>) => {
    try {
      const result = await controller(ctx);
      if (result.hasError) {
        logger.error({ url: ctx.request.url, error: result.error });
        ctx.response.status = result.error.responseCode;
        ctx.response.body = { error: result.error.responseDesc };
      } else {
        ctx.response.status = result.success.responseCode;
        ctx.response.body = result.success.data as ResponseBody;
      }
    } catch (error: any) {
      logger.error({ url: ctx.request.url, error });
      ctx.response.status = httpCodes.internalServerError;
      ctx.response.body = {
        error: internalServerErrorResponse().error.responseDesc,
      };
    }
  };
}

export interface IControllerCreator<TData, TResult> {
  route: string;
  middlewares?: MiddlewareFn[];
  selector?: (ctx: RouterContext<any>) => Promise<TData>;
  controller: (data: TData) => ControllerResponse<TResult>;
}

export class RouterAdapter<T> {
  constructor(
    private route: string,
    private middlewares: MiddlewareFn[],
    private controller: (ctx: RouterContext<any>) => ControllerResponse<T>,
  ) {
  }

  get(router: Router) {
    router.get(this.route, this.middlewareManager.bind(this));
  }

  private async middlewareManager(ctx: RouterContext<any>) {
    for (const m of this.middlewares) {
      await m(ctx);
    }
    await baseController(this.controller)(ctx);
  }

  post(router: Router) {
    router.post(this.route, this.middlewareManager.bind(this));
  }
}

export function createController<TData, TResult>(
  creator: IControllerCreator<TData, TResult>,
) {
  const middlewares = creator.middlewares ?? [];
  const selector = creator.selector ??
    ((ctx: RouterContext<any>) => ctx as TData);
  const controller = async (ctx: RouterContext<any>) => {
    const req = await selector(ctx);
    return creator.controller(req);
  };
  return new RouterAdapter(creator.route, middlewares, controller);
}

export function jsonBodySelector(ctx: RouterContext<any>) {
  return ctx.request.body({ type: "json" }).value;
}
