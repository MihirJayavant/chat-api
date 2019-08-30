export interface IActionResult {
  statusCode: number
  response: any
}

export interface IResponseMessage {
  response: { message: string }
}

export function createResponseMessage(statusCode: number, message: string): IActionResult {
  const mess: IResponseMessage = { response: { message } }
  return {
    statusCode,
    ...mess
  }
}
