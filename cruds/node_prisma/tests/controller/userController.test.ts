import { Request, Response, NextFunction } from "express";
import {
  createUser,
  getUsers,
  deleteUser,
  getUserById,
  getUserByEmail,
  updateUser,
  loginController,
} from "../../src/controller/userController";
import {
  createUserService,
  getUsersService,
  deleteUserService,
  getUserByIdService,
  getUserByEmailService,
  updateUserService,
  loginService,
} from "../../src/service/userService";
import { StatusCodes } from "http-status-codes";

jest.mock("../../src/service/userService");

jest.mock("../../src/config/logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

describe("User Controller Tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  test("createUser should create a new user", async () => {
    req.body = {
      Name: "John Doe",
      Email: "john@example.com",
      Password: "securepassword",
    };
    const userCreated = { id: 1, ...req.body };
    (createUserService as jest.Mock).mockResolvedValue(userCreated);

    await createUser(req as Request, res as Response, next);

    expect(createUserService).toHaveBeenCalledWith(
      "John Doe",
      "john@example.com",
      "securepassword",
    );
    expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
    expect(res.send).toHaveBeenCalledWith(userCreated);
  });

  test("getUsers should return all users", async () => {
    const users = [{ id: 1, name: "John Doe", email: "john@example.com" }];
    (getUsersService as jest.Mock).mockResolvedValue(users);

    await getUsers(req as Request, res as Response);

    expect(getUsersService).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(res.send).toHaveBeenCalledWith(users);
  });

  test("deleteUser should delete a user", async () => {
    req.params = { userId: "1" };

    await deleteUser(req as Request, res as Response, next);

    expect(deleteUserService).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.GONE);
    expect(res.json).toHaveBeenCalledWith("User with id 1 deleted");
  });

  test("getUserById should return a user", async () => {
    req.params = { userId: "1" };
    const user = { id: 1, name: "John Doe", email: "john@example.com" };
    (getUserByIdService as jest.Mock).mockResolvedValue(user);

    await getUserById(req as Request, res as Response, next);

    expect(getUserByIdService).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(res.send).toHaveBeenCalledWith(user);
  });

  test("getUserByEmail should return a user", async () => {
    req.params = { userEmail: "john@example.com" };
    const user = { id: 1, name: "John Doe", email: "john@example.com" };
    (getUserByEmailService as jest.Mock).mockResolvedValue(user);

    await getUserByEmail(req as Request, res as Response, next);

    expect(getUserByEmailService).toHaveBeenCalledWith("john@example.com");
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(res.send).toHaveBeenCalledWith(user);
  });

  test("updateUser should update a user", async () => {
    req.params = { userId: "1" };
    req.body = { Name: "John Updated", Password: "newpassword" };
    const userUpdated = {
      id: 1,
      name: "John Updated",
      email: "john@example.com",
    };
    (updateUserService as jest.Mock).mockResolvedValue(userUpdated);

    await updateUser(req as Request, res as Response, next);

    expect(updateUserService).toHaveBeenCalledWith(
      1,
      "John Updated",
      "newpassword",
    );
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(res.send).toHaveBeenCalledWith(userUpdated);
  });

  test("updateUser should not call updateUserService if userId is missing", async () => {
    jest.resetAllMocks();
    req.params = {};
    req.body = { Name: "John Updated", Password: "newpassword" };

    await updateUser(req as Request, res as Response, next);

    expect(updateUserService).not.toHaveBeenCalled();
  });

  test("loginController should return a token for valid credentials", async () => {
    req.body = { Email: "john@example.com", Password: "securepassword" };
    const loginResult = {
      rest: { id: 1, name: "John Doe", email: "john@example.com" },
      token: "fake-token",
    };
    (loginService as jest.Mock).mockResolvedValue(loginResult);

    await loginController(req as Request, res as Response, next);

    expect(loginService).toHaveBeenCalledWith(
      "john@example.com",
      "securepassword",
    );
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(res.json).toHaveBeenCalledWith(loginResult);
  });
});
