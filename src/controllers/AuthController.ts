import * as jwt from 'jsonwebtoken'
import { getRepository } from 'typeorm'

import { User } from '../entity/User'
import { config } from '../config'
import { IUserAddApiModel, IActionResult, createResponseMessage } from '../models'
import { LoginModel } from '../api-models'




export async function login(login: LoginModel): Promise<IActionResult<any>> {
  //Check if username and password are set
  const { username, password } = login

  //Get user from database
  const userRepository = getRepository(User)

  const user = await userRepository.findOne({ where: { username } })

  if (!user) {
    return createResponseMessage(404, 'Invalid username or password')
  }

  //Check if encrypted password match
  if (!(await user.checkIfUnencryptedPasswordIsValid(password))) {
    return createResponseMessage(401, 'Invalid username or password')
  }

  //Sign JWT, valid for 1 hour
  const token = jwt.sign({ userId: user.id, username: user.username }, config.tokenSecret, { expiresIn: '1h' })

  //Send the jwt in the response
  return { statusCode: 200, response: { accessToken: token } }
}

export async function signUp(user: IUserAddApiModel): Promise<IActionResult<any>> {
  //Get parameters from the body
  const { username, password, firstname, lastname } = user
  const userEntity = new User()
  userEntity.username = username
  userEntity.password = password
  userEntity.role = 'normal'
  userEntity.firstname = firstname
  userEntity.lastname = lastname

  //Hash the password, to securely store on DB
  await userEntity.hashPassword()

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

