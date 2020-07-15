import { IActionResult } from "../models";
import { Request, Response } from "express";

export type ControllerFn =  (req: Request) => Promise<IActionResult<any>>

export function baseController(controller: ControllerFn) {

  return async (req: Request, res: Response) => {

      const { statusCode, response } = await controller(req)
      res.status(statusCode).send(response)

  }
}
