import { Context } from "hono";

export const addBlog = async (c:Context) => {
    return c.json({mssg: "addBlog"})
}

export const updateBlog = async (c:Context) => {
    return c.json({mssg: "updateBlog"})
}

export const getBlog = async (c:Context) => {
    return c.json({mssg: "getBlog"})
}

export const getBlogs = async (c:Context) => {
    return c.json({mssg: "getBlogs"})
}