import { prismaClient } from "../../src/config";
import { UserModel } from "../../src/model/userModel";
import {
    createUserRepo,
    deleteUserRepo,
    getByEmailRepo,
    getByIdRepo,
    getUsersRepo,
    updateUserRepo,
} from "../../src/repository/userRepository";


jest.mock('../../src/config', () => ({
    prismaClient: {
        user: {
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findFirst: jest.fn(),
            findMany: jest.fn()
        }
    }
}));

describe('User Repository Tests', () => {
    const user: UserModel = { name: 'John Doe', email: 'john@example.com', password: 'securepassword' };
    const userId = 1;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('createUserRepo should create a new user', async () => {
        (prismaClient.user.create as jest.Mock).mockResolvedValue({ ...user, id: userId });

        const result = await createUserRepo(user);

        expect(prismaClient.user.create).toHaveBeenCalledWith({
            data: { name: user.name, email: user.email, password: user.password }
        });
        expect(result).toEqual({ ...user, id: userId });
    });

    test('updateUserRepo should update an existing user', async () => {
        const updatedUser = { ...user, name: 'John Smith' };
        (prismaClient.user.update as jest.Mock).mockResolvedValue(updatedUser);

        const result = await updateUserRepo(userId, updatedUser);

        expect(prismaClient.user.update).toHaveBeenCalledWith({
            where: { id: userId },
            data: { name: updatedUser.name, password: updatedUser.password }
        });
        expect(result).toEqual(updatedUser);
    });

    test('deleteUserRepo should delete a user', async () => {
        await deleteUserRepo(userId);

        expect(prismaClient.user.delete).toHaveBeenCalledWith({
            where: { id: userId }
        });
    });

    test('getByIdRepo should return a user by id', async () => {
        (prismaClient.user.findFirst as jest.Mock).mockResolvedValue(user);

        const result = await getByIdRepo(userId);

        expect(prismaClient.user.findFirst).toHaveBeenCalledWith({
            where: { id: userId }
        });
        expect(result).toEqual(user);
    });

    test('getByEmailRepo should return a user by email', async () => {
        (prismaClient.user.findFirst as jest.Mock).mockResolvedValue(user);

        const result = await getByEmailRepo(user.email);

        expect(prismaClient.user.findFirst).toHaveBeenCalledWith({
            where: { email: user.email }
        });
        expect(result).toEqual(user);
    });

    test('getUsersRepo should return all users', async () => {
        const users = [user];
        (prismaClient.user.findMany as jest.Mock).mockResolvedValue(users);

        const result = await getUsersRepo();

        expect(prismaClient.user.findMany).toHaveBeenCalled();
        expect(result).toEqual(users);
    });
});

