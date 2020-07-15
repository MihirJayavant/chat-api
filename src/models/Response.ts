
export interface ISucessResult<T> {
  statusCode: number
  response: T
}

export interface IMessageResponse {
  statusCode: number
  response: { message: string }
}

export type IActionResult<T> = ISucessResult<T> | IMessageResponse


export function createResponseMessage(statusCode: number, message: string): IMessageResponse {
  return {
    statusCode,
    response: { message }
  }
}
