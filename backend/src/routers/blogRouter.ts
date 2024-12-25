import { Hono } from "hono";
import { addBlog, getBlog, getBlogs, updateBlog } from "../controllers/blogController";

const blogRouter = new Hono()

blogRouter.post("/", addBlog)
blogRouter.put("/", updateBlog)
blogRouter.get("/bulk", getBlogs)
blogRouter.get("/:id", getBlog)

export default blogRouter