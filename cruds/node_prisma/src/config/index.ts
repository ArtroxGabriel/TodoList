import { PrismaClient } from "@prisma/client";
import logger from "./logger";

export const PORT = process.env.PORT ?? 3001
export const JWT_SECRET = process.env.JWT_SECRET!


export const prismaClient = new PrismaClient({
    log: [
        {
            emit: 'event',
            level: 'query',
        },
        {
            emit: 'event',
            level: 'error',
        },
        {
            emit: 'event',
            level: 'info',
        },
        {
            emit: 'event',
            level: 'warn',
        },
    ],
})

prismaClient.$on('query', (e) => {
    logger.info('Query executed', { query: e.query, params: e.params, duration: e.duration + "ms" });
});

prismaClient.$on('info', (e) => {
    logger.info(e.message, { target: e.target });
});

prismaClient.$on('warn', (e) => {
    logger.warn(e.message, { target: e.target });
});

prismaClient.$on('error', (e) => {
    logger.error(e.message, { target: e.target });
});

