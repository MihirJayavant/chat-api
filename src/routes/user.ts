import { Router } from 'express'
import { checkJwt } from '../middlewares/checkJwt'
import { checkRole } from '../middlewares/checkRole'
import { baseController, listAll, getOneById, editUser, deleteUser } from '../controllers'

const router = Router()

//Get all users
router.get('/', [checkJwt], baseController(_req => listAll()))

// Get one user
router.get('/:id([0-9]+)', [checkJwt, checkRole(['ADMIN'])], getOneById)

//Edit one user
router.put('/:id([0-9]+)', [checkJwt, checkRole(['ADMIN'])], editUser)

//Delete one user
router.delete('/:id([0-9]+)', [checkJwt, checkRole(['ADMIN'])], deleteUser)

export default router
