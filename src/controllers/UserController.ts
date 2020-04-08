import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import { validate } from 'class-validator'

import { User } from '../entity/User'
import { IActionResult } from '../models'


export async function listAll(): Promise<IActionResult<any>> {
  //Get users from database
  const userRepository = getRepository(User)
  const users = await userRepository.find({
    select: ['id', 'username', 'role'], //We dont want to send the passwords on response
  })

  return { statusCode: 200, response: users }
}

export async function getOneById(req: Request, res: Response) {
  //Get the ID from the url
  const id: number = req.params.id

  //Get the user from database
  const userRepository = getRepository(User)
  try {
    const user = await userRepository.findOneOrFail(id, {
      select: ['id', 'username', 'role'], //We dont want to send the password on response
    })
  } catch (error) {
    res.status(404).send('User not found')
  }
}

export async function editUser(req: Request, res: Response) {
  //Get the ID from the url
  const id = req.params.id

  //Get values from the body
  const { username, role } = req.body

  //Try to find user on database
  const userRepository = getRepository(User)
  let user
  try {
    user = await userRepository.findOneOrFail(id)
  } catch (error) {
    //If not found, send a 404 response
    res.status(404).send('User not found')
    return
  }

  //Validate the new values on model
  user.username = username
  user.role = role
  const errors = await validate(user)
  if (errors.length > 0) {
    res.status(400).send(errors)
    return
  }

  //Try to safe, if fails, that means username already in use
  try {
    await userRepository.save(user)
  } catch (e) {
    res.status(409).send('username already in use')
    return
  }
  //After all send a 204 (no content, but accepted) response
  res.status(204).send()
}

export async function deleteUser(req: Request, res: Response) {
  //Get the ID from the url
  const id = req.params.id

  const userRepository = getRepository(User)
  let user: User
  try {
    user = await userRepository.findOneOrFail(id)
  } catch (error) {
    res.status(404).send('User not found')
    return
  }
  userRepository.delete(id)

  //After all send a 204 (no content, but accepted) response
  res.status(204).send()
}

