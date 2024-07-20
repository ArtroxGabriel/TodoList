import { PrismaClient } from "@prisma/client"

export const PORT = process.env.PORT ?? 3001
export const JWT_SECRET = process.env.JWT_SECRET!


export const prismaClient = new PrismaClient({
    log: ['query']
})
