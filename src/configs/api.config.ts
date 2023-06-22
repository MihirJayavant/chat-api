export const httpCodes = {
  ok: 200,
  created: 201,
  badRequest: 400,
  unAuthorized: 401,
  notFound: 404,
  conflict: 409,
  internalServerError: 500,
} as const;

export type IResult<T> = ISuccess<T> | IError;

export interface IError {
  hasError: true;
  error: { responseCode: number; responseDesc: string };
}

export interface ISuccess<T> {
  hasError: false;
  success: { responseCode: number; data: T };
}

export function errorResponse(status: number, message: string): IError {
  return {
    hasError: true,
    error: {
      responseCode: status,
      responseDesc: message,
    },
  };
}

export function okResponse<T>(data: T): ISuccess<T> {
  return {
    hasError: false,
    success: {
      responseCode: httpCodes.ok,
      data,
    },
  };
}

export function badRequestResponse(message = "Bad Request") {
  return errorResponse(httpCodes.badRequest, message);
}

export function unAuthorizedResponse(message = "UnAuthorized") {
  return errorResponse(httpCodes.unAuthorized, message);
}

export function notFoundResponse(message = "Not Found") {
  return errorResponse(httpCodes.notFound, message);
}

export function internalServerErrorResponse(message = "Internal Server Error") {
  return errorResponse(httpCodes.internalServerError, message);
}
