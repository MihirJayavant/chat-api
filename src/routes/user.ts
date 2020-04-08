import { Router, Request, Response } from 'express'
import { listAll, getOneById, editUser, deleteUser } from '../controllers/UserController'
import { checkJwt } from '../middlewares/checkJwt'
import { checkRole } from '../middlewares/checkRole'

const router = Router()

//Get all users
router.get('/', [checkJwt], async (req: Request, res: Response) => {
  const { statusCode, response } = await listAll()
  res.status(statusCode).send(response)
})

// Get one user
router.get('/:id([0-9]+)', [checkJwt, checkRole(['ADMIN'])], getOneById)

//Edit one user
router.put('/:id([0-9]+)', [checkJwt, checkRole(['ADMIN'])], editUser)

//Delete one user
router.delete('/:id([0-9]+)', [checkJwt, checkRole(['ADMIN'])], deleteUser)

export default router
