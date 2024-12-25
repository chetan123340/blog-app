import { Context } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

enum STATUSCODES {
    OK = 200,
    BAD = 403
}

export const addBlog = async (c:Context) => {
    const prisma = new PrismaClient({datasourceUrl: c.env.DATABASE_URL}).$extends(withAccelerate())
    try {
        const authorId = c.get("authorId")
        const body = await c.req.json()
        const blog = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: authorId
            }
        })
        return c.json({blog}) 
    } catch (error) {
        c.status(STATUSCODES.BAD)
        return c.json({error})
    }
}

export const updateBlog = async (c:Context) => {
    const prisma = new PrismaClient({datasourceUrl: c.env.DATABASE_URL}).$extends(withAccelerate())
    try {
        const body = await c.req.json()
        const blog = await prisma.post.update({
            where:{
                id: body.id,
                authorId: c.get("authorId")
            },
            data: {
                title: body.title,
                content: body.content,
                published: body.published
            }
        })
        c.status(STATUSCODES.OK)
        return c.json({blog})
    } catch (error) {
        c.status(STATUSCODES.BAD)
        return c.json({error})
    }
}

export const getBlog = async (c:Context) => {
    const prisma = new PrismaClient({datasourceUrl: c.env.DATABASE_URL}).$extends(withAccelerate())
    try {
        const blogId = c.req.param("id")
        const blog = await prisma.post.findFirst({
            where: {
                id: blogId
            }
        })
        c.status(STATUSCODES.OK)
        return c.json({blog})
    } catch (error) {
        c.status(STATUSCODES.BAD)
        return c.json({error})
    }
}

export const getBlogs = async (c:Context) => {
    const prisma = new PrismaClient({datasourceUrl: c.env.DATABASE_URL}).$extends(withAccelerate())
    try {
        const blogs = await prisma.post.findMany({})
        c.status(STATUSCODES.OK)
        return c.json({blogs})
    } catch (error) {
        c.status(STATUSCODES.BAD)
        return c.json({error})
    }
}