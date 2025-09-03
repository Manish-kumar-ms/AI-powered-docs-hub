import express from 'express'
import { CurrentUser, login, logout, signup } from '../controller/AuthController.js'
import { ensureAuthenticated } from '../Middleware/isAuth.js'

const router=express.Router()


router.post('/login',login)

router.post('/signup', signup)
router.post('/logout', logout)

router.get('/CurrentUser',ensureAuthenticated,CurrentUser)




export default router