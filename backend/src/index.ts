import { Hono } from 'hono'
import userRouter from './routers/userRouter'
import blogRouter from './routers/blogRouter'

const app = new Hono()

app.route('/api/v1/user', userRouter)
app.route("/api/v1/blog", blogRouter)

export default app
