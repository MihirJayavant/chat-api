export interface IActionResult<T> {
  statusCode: number
  response: T
}

export interface IResponseMessage {
  response: { message: string }
}

export function createResponseMessage(statusCode: number, message: string): IActionResult<any> {
  const mess: IResponseMessage = { response: { message } }
  return {
    statusCode,
    ...mess,
  }
}
