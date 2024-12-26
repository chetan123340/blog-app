import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Context } from "hono";
import { sign } from 'hono/jwt';
import bcrypt from "bcryptjs";
import { signinSchema, signupSchema } from '@chetan_k_p/blog-common'

enum STATUSCODES {
    OK = 200,
    BAD = 403,
    MISSING_IP = 411
}

const saltRounds = 10

export const signupUser = async (c: Context) => {
    const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate())
    const body = await c.req.json()
    try {
        const { success } = signupSchema.safeParse(body)

        if (! success) {
            c.status(STATUSCODES.MISSING_IP)
            return c.json({mssg: "Missing inputs"})
        }

        const exist = await prisma.author.findFirst({
            where: {
                email: body.email
            }
        })
        if (exist) {
            c.status(STATUSCODES.OK)
            return c.json({ mssg: "User already exists" })
        }
        const hashedPassword = await bcrypt.hash(body.password, saltRounds);
        const author = await prisma.author.create({
            data: {
                email: body.email,
                password: hashedPassword,
                name: body.name
            }
        })
        const token = await sign({ authorId: author.id }, c.env.JWT_SECRET)
        c.status(STATUSCODES.OK)
        return c.json({ token: `Bearer ${token}` })
    } catch (error) {
        c.status(STATUSCODES.BAD)
        return c.json({ error })
    }
}

export const signinUser = async (c: Context) => {
    const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate())
    const body = await c.req.json()
    try {
        const { success } = signinSchema.safeParse(body)

        if (!success) {
            c.status(STATUSCODES.MISSING_IP)
            return c.json({ mssg: "Missing inputs" })
        }
        
        const exist = await prisma.author.findFirst({
            where: {
                email: body.email
            }
        })

        if (!exist) {
            c.status(STATUSCODES.OK)
            return c.json({ mssg: "User does not exist" })
        }

        const isMatch = await bcrypt.compare(body.password, exist.password);
        if (!isMatch) {
            c.status(STATUSCODES.OK)
            return c.json({ mssg: "Incorrect password" })
        }

        const token = await sign({ authorId: exist.id }, c.env.JWT_SECRET)
        c.status(STATUSCODES.OK)
        return c.json({ token: `Bearer ${token}` })
    } catch (error) {
        c.status(STATUSCODES.BAD)
        return c.json({ error })
    }
}