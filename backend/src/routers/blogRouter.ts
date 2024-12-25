import { Hono } from "hono";
import { addBlog, getBlog, getBlogs, updateBlog } from "../controllers/blogController";
import { authMiddleware } from "../middleware/auth";

const blogRouter = new Hono()

blogRouter.post("/", authMiddleware, addBlog)
blogRouter.put("/", authMiddleware, updateBlog)
blogRouter.get("/bulk", getBlogs)
blogRouter.get("/:id", authMiddleware, getBlog)

export default blogRouter