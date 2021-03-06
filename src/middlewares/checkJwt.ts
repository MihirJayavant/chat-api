import { Request, Response, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken'
import { config } from '../config'
import { createResponseMessage } from '../models'

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  //Get the jwt token from the head
  const auth = req.headers['authorization'] as string

  if (!auth) {
    const { statusCode, response } = createResponseMessage(401, 'No token found')
    res.status(statusCode).send(response)
    return
  }

  const token = auth.replace('Bearer ', '')
  let jwtPayload

  //Try to validate the token and get data
  try {
    jwtPayload = <any>jwt.verify(token, config.tokenSecret)
    res.locals.jwtPayload = jwtPayload
  } catch (error) {
    //If token is not valid, respond with 401 (unauthorized)
    res.status(401).send()
    return
  }

  //The token is valid for 1 hour
  //We want to send a new token on every request
  const { userId, username } = jwtPayload
  const newToken = jwt.sign({ userId, username }, config.tokenSecret, {
    expiresIn: '1h',
  })
  res.setHeader('token', newToken)

  //Call the next middleware or controller
  next()
}
