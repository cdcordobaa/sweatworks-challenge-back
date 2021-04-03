import { User } from '../../entities/User';
import { findUserByEmail, passwordUserCreateDB, passwordUpdate } from './db';
import { UserCreateObjectPassword } from '../../shared/types/user';
import { Connection } from 'typeorm';
import { AuthResponseCodes } from '../../shared/constants/responseCodes/auth';

export const createPasswordUser = async (dbConn: Connection, userObject: UserCreateObjectPassword): Promise<User> => {
    return passwordUserCreateDB(dbConn, userObject);
};

export const verified = async (dbConn: Connection, userObject: UserCreateObjectPassword): Promise<User> => {
    return passwordUserCreateDB(dbConn, userObject);
};

export const updatePasswordForUser = async (dbConn: Connection, email: string, newPassword: string): Promise<User> => {
    const user = await findUserByEmail(dbConn, email);

    if (!user)
        throw {
            message: `User with email ${email} does not exist`,
            code: 400,
            statusCode: AuthResponseCodes.INVALID_TOKEN,
        };

    return passwordUpdate(dbConn, user, newPassword);
};
