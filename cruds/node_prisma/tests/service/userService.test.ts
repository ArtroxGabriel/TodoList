import { compareSync, hashSync } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../src/config';
import { BadRequestException } from '../../src/exceptions/badRequest';
import { UserModel } from '../../src/model/userModel';
import {
    createUserRepo,
    deleteUserRepo,
    getUsersRepo,
    getByEmailRepo,
    getByIdRepo,
    updateUserRepo
} from '../../src/repository/userRepository';
import {
    createUserService,
    updateUserService,
    getUsersService,
    getByIdService,
    getByEmailService,
    deleteUserService,
    loginService
} from '../../src/service/userService';

jest.mock('../../src/repository/userRepository', () => ({
    createUserRepo: jest.fn(),
    deleteUserRepo: jest.fn(),
    getUsersRepo: jest.fn(),
    getByEmailRepo: jest.fn(),
    getByIdRepo: jest.fn(),
    updateUserRepo: jest.fn()
}));

jest.mock('../../src/config/logger', () => ({
    info: jest.fn(),
    error: jest.fn()
}));


// Mock do bcrypt e jwt
jest.mock('bcrypt', () => ({
    hashSync: jest.fn(),
    compareSync: jest.fn()
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn()
}));

describe('User Service Tests', () => {
    const user: UserModel = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'securepassword',
        lists: [],
    };
    const userId = 1;
    const token = 'fake-token';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('createUserService should create a new user', async () => {
        (getByEmailRepo as jest.Mock).mockResolvedValue(null);
        (hashSync as jest.Mock).mockReturnValue('hashedpassword');
        (createUserRepo as jest.Mock).mockResolvedValue({ ...user, id: userId, password: 'hashedpassword' });

        const result = await createUserService(user.name, user.email, user.password);

        expect(getByEmailRepo).toHaveBeenCalledWith(user.email);
        expect(createUserRepo).toHaveBeenCalledWith({ ...user, password: 'hashedpassword' });
        expect(result).toEqual({ ...user, id: userId, password: 'hashedpassword' });
    });

    test('createUserService should throw an error if user already exists', async () => {
        (getByEmailRepo as jest.Mock).mockResolvedValue(user);

        await expect(createUserService(user.name, user.email, user.password)).rejects.toThrow(BadRequestException);
    });

    test('updateUserService should update an existing user', async () => {
        (getByIdRepo as jest.Mock).mockResolvedValue({ ...user, id: userId });
        (updateUserRepo as jest.Mock).mockResolvedValue({ ...user, id: userId });
        (hashSync as jest.Mock).mockReturnValue('hashedpassword');

        const result = await updateUserService(userId, user.name, user.password);

        expect(getByIdRepo).toHaveBeenCalledWith(userId);
        expect(updateUserRepo).toHaveBeenCalledWith(userId, {
            ...user,
            email: "",
            password: 'hashedpassword'
        }
        );
        expect(result).toEqual({ ...user, id: userId });
    });

    test('getUsersService should return all users without passwords', async () => {
        (getUsersRepo as jest.Mock).mockResolvedValue([{ ...user, password: 'hashedpassword' }]);

        const result = await getUsersService();

        expect(getUsersRepo).toHaveBeenCalled();
        expect(result).toEqual([{ name: user.name, email: user.email, lists: [] }]);
    });

    test('getByIdService should return a user by id without password', async () => {
        (getByIdRepo as jest.Mock).mockResolvedValue({ ...user, id: userId, password: 'hashedpassword' });

        const result = await getByIdService(userId);

        expect(getByIdRepo).toHaveBeenCalledWith(userId);
        expect(result).toEqual({ id: userId, name: user.name, email: user.email, lists: [] });
    });

    test('getByEmailService should return a user by email without password', async () => {
        (getByEmailRepo as jest.Mock).mockResolvedValue({ ...user, password: 'hashedpassword' });

        const result = await getByEmailService(user.email);

        expect(getByEmailRepo).toHaveBeenCalledWith(user.email);
        expect(result).toEqual({ name: user.name, email: user.email, lists: [] });
    });

    test('deleteUserService should delete a user', async () => {
        (getByIdRepo as jest.Mock).mockResolvedValue({ ...user, id: userId });

        await deleteUserService(userId);

        expect(getByIdRepo).toHaveBeenCalledWith(userId);
        expect(deleteUserRepo).toHaveBeenCalledWith(userId);
    });

    test('loginService should return a token for valid credentials', async () => {
        (getByEmailRepo as jest.Mock).mockResolvedValue({ ...user, id: userId, password: 'hashedpassword' });
        (compareSync as jest.Mock).mockReturnValue(true);
        (jwt.sign as jest.Mock).mockReturnValue(token);
        (hashSync as jest.Mock).mockReturnValue('hashedpassword');

        const result = await loginService(user.email, user.password);

        expect(getByEmailRepo).toHaveBeenCalledWith(user.email);
        expect(compareSync).toHaveBeenCalledWith(user.password, 'hashedpassword');
        expect(jwt.sign).toHaveBeenCalledWith({ userId: userId }, JWT_SECRET);
        expect(result).toEqual({ rest: { id: userId, name: user.name, email: user.email, lists: [] }, token });
    });

    test('loginService should throw error for incorrect credentials', async () => {
        (getByEmailRepo as jest.Mock).mockResolvedValue({ ...user, password: 'hashedpassword' });
        (compareSync as jest.Mock).mockReturnValue(false);

        await expect(loginService(user.email, user.password)).rejects.toThrow(BadRequestException);
    });
});

