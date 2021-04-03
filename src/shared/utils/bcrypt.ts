import { genSalt, hash, compare } from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
    const salt = await genSalt(10);
    return await hash(password, salt);
};

export const verifyPassword = async (realPassword: string, password: string): Promise<boolean> => {
    return compare(password, realPassword);
};
