import {Hono} from 'hono'
import { signinUser, signupUser } from '../controllers/userController'

const userRouter = new Hono()

userRouter.post("/signup", signupUser)
userRouter.post("/signin", signinUser)

export default userRouter