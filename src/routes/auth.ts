import { Router, Response, Request } from 'express'
import { AuthController } from '../controllers/AuthController'
import { createUserAddModel, createLoginModel } from '../api-models'
import { checkBody } from '../middlewares'

const router = Router()

//Login route
router.post('/login', [checkBody(createLoginModel)], async (req: Request, res: Response) => {
  const { statusCode, response } = await AuthController.login(req.body)
  res.status(statusCode).send(response)
})

//signup new users
router.post('/signup', [checkBody(createUserAddModel)], async (req, res) => {
  const { statusCode, response } = await AuthController.signUp(req.body)
  res.status(statusCode).send(response)
})

export default router
