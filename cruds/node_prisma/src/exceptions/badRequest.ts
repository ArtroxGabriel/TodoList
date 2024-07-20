import { StatusCodes } from "http-status-codes";
import { ErrorCodes, HttpException } from "./httpException";

export class BadRequestException extends HttpException {
    constructor(message: string, errorCode: ErrorCodes) {
        super(message, errorCode, StatusCodes.BAD_REQUEST, null)
    }
}
