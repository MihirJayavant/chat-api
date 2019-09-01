import { Router } from 'express'
import { AuthController } from '../controllers/AuthController'
import { createUserAddModel, createLoginModel } from '../api-models'
import { validate, ValidationError } from 'class-validator'
import { createResponseMessage } from '../models'

const router = Router()

// get error
function standardizeError(errors: ValidationError[]) {
  const constraints = errors[0].constraints
  const messages = Object.keys(constraints).map(p => constraints[p])
  return messages[0]
}

//Login route
router.post('/login', async (req, res) => {
  const login = createLoginModel(req.body)

  // Validate if the parameters are ok
  const errors = await validate(login)
  if (errors.length > 0) {
    const errRes = createResponseMessage(400, standardizeError(errors))
    res.status(errRes.statusCode).send(errRes.response)
    return
  }

  // controller
  const result = await AuthController.login(login)
  res.status(result.statusCode).send(result.response)
})

//signup new users
router.post('/signup', async (req, res) => {
  const user = createUserAddModel(req.body)

  // Validate if the parameters are ok
  const errors = await validate(user)
  if (errors.length > 0) {
    console.log(errors[0])
    const errRes = createResponseMessage(400, standardizeError(errors))
    res.status(errRes.statusCode).send(errRes.response)
    return
  }

  // controller
  const result = await AuthController.signUp(user)
  res.status(result.statusCode).send(result.response)
})

export default router
