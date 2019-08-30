import { Router } from 'express'
import { AuthController } from '../controllers/AuthController'
import { checkJwt } from '../middlewares/checkJwt'
import { UserAddModel } from '../api-models'
import { validate } from 'class-validator'

const router = Router()
//Login route
router.post('/login', AuthController.login)

//Change my password
router.post('/change-password', [checkJwt], AuthController.changePassword)

//signup new users
router.post('/signup', async (req, res) => {
  const { firstname, lastname, password, username } = req.body
  //check payload
  const user = new UserAddModel()
  user.firstname = firstname
  user.lastname = lastname
  user.password = password
  user.username = username

  // Validate if the parameters are ok
  const errors = await validate(user)
  if (errors.length > 0) {
    res.status(400).send(errors)
    return
  }

  const result = await AuthController.signUp(user)
  res.status(result.statusCode).send(result.response)
})

export default router
