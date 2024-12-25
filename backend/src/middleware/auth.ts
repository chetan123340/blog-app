import { Context, Next } from "hono";
import { verify } from "hono/jwt";

enum STATUSCODES {
    OK = 200,
    BAD = 403
}


export const authMiddleware = async (c:Context, next: Next) => {
    const authorizationHeader = c.req.header("Authorization");

    if (!authorizationHeader) {
        c.status(STATUSCODES.BAD);
        return c.json({ mssg: "Authorization header missing" });
    }
    
    try {
        const token = authorizationHeader.split(" ")[1];

        const verified = await verify(token, c.env.JWT_SECRET)
        c.set("authorId", verified.authorId)
        await next()
    } catch (error) {
        c.status(STATUSCODES.BAD)
        return c.json({error: "Invalid jwt"})
    }
    
    
}