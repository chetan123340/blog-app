import { Context } from "hono";

export const signupUser = async (c:Context) => {
    return c.json({mssg: "siginup"})
}

export const signinUser = async (c:Context) => {
    return c.json({mssg: "signinUser"})
}