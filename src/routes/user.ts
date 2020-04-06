import { Router } from 'express'
import { UserController } from '../controllers/UserController'
import { checkJwt } from '../middlewares/checkJwt'
import { checkRole } from '../middlewares/checkRole'

const router = Router()

//Get all users
router.get('/', [checkJwt], async (req, res) => {
  const { statusCode, response } = await UserController.listAll()
  res.status(statusCode).send(response)
})

// Get one user
router.get('/:id([0-9]+)', [checkJwt, checkRole(['ADMIN'])], UserController.getOneById)

//Edit one user
router.put('/:id([0-9]+)', [checkJwt, checkRole(['ADMIN'])], UserController.editUser)

//Delete one user
router.delete('/:id([0-9]+)', [checkJwt, checkRole(['ADMIN'])], UserController.deleteUser)

export default router
