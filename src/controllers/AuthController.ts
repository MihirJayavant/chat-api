import { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import { getRepository } from 'typeorm'
import { validate } from 'class-validator'
import { Get, Post, Route, Body, Query, Header, Path, SuccessResponse, Controller } from 'tsoa'

import { User } from '../entity/User'
import { config } from '../config'
import { IUserAddApiModel, IActionResult, createResponseMessage } from '../models'

@Route('auth')
export class AuthController {
  @Post()
  @SuccessResponse(200)
  static async login(req: Request, res: Response) {
    //Check if username and password are set
    const { username, password } = req.body

    if (!(username && password)) {
      res.status(400).send()
      return
    }

    //Get user from database
    const userRepository = getRepository(User)
    let user: User
    try {
      user = await userRepository.findOneOrFail({ where: { username } })
    } catch (error) {
      res.status(401).send()
    }

    if (!user) {
      res.status(404).send()
      return
    }

    //Check if encrypted password match
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      res.status(401).send()
      return
    }

    //Sign JWT, valid for 1 hour
    const token = jwt.sign({ userId: user.id, username: user.username }, config.tokenSecret, { expiresIn: '1h' })

    //Send the jwt in the response
    res.send({ token })
  }

  static async changePassword(req: Request, res: Response) {
    //Get ID from JWT
    const id = res.locals.jwtPayload.userId

    //Get parameters from the body
    const { oldPassword, newPassword } = req.body
    if (!(oldPassword && newPassword)) {
      res.status(400).send()
    }

    //Get user from the database
    const userRepository = getRepository(User)
    let user: User
    try {
      user = await userRepository.findOneOrFail(id)
    } catch (id) {
      res.status(401).send()
    }

    //Check if old password matchs
    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
      res.status(401).send()
      return
    }

    //Validate de model (password lenght)
    user.password = newPassword
    const errors = await validate(user)
    if (errors.length > 0) {
      res.status(400).send(errors)
      return
    }
    //Hash the new password and save
    user.hashPassword()
    userRepository.save(user)

    res.status(204).send()
  }

  static async signUp(user: IUserAddApiModel): Promise<IActionResult> {
    //Get parameters from the body
    const { username, password, firstname, lastname } = user
    const userEntity = new User()
    userEntity.username = username
    userEntity.password = password
    userEntity.role = 'normal'
    userEntity.firstname = firstname
    userEntity.lastname = lastname

    //Hash the password, to securely store on DB
    userEntity.hashPassword()

    //Try to save. If fails, the username is already in use
    const userRepository = getRepository(User)
    try {
      await userRepository.save(userEntity)
    } catch (e) {
      return createResponseMessage(409, 'username already in use')
    }

    //If all ok, send 201 response
    return createResponseMessage(201, 'User created')
  }
}
