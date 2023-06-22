// deno-lint-ignore-file no-explicit-any
import { helpers, RouterContext, z } from "/deps.ts";

z.object({});

export function validateBody<T extends z.ZodRawShape>(schema: z.ZodObject<T>) {
  return async (ctx: RouterContext<any>, next: () => Promise<any>) => {
    const result = await schema.safeParseAsync(ctx.request.body);
    if (!result.success) {
      ctx.response.status = 400;
      ctx.response.body = { error: result.error };
      return;
    }

    next();
  };
}

export function validateQueryParams<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
) {
  return async (ctx: RouterContext<any>, next: () => Promise<any>) => {
    const query = helpers.getQuery(ctx, { mergeParams: true });
    const result = await schema.safeParseAsync(query);
    if (!result.success) {
      ctx.response.status = 400;
      ctx.response.body = { error: result.error };
      return;
    }

    next();
  };
}
