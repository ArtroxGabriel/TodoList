import { PrismaClient } from "@prisma/client"

export const PORT = process.env.PORT || 3001


export const prismaClient = new PrismaClient({
    log: ['query']
})
