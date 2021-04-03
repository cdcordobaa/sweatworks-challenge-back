import { Connection } from 'typeorm';
import { UserCreateObjectPassword } from '../../shared/types/user';
import { User } from '../../entities/User';
import { hashPassword } from '../../shared/utils/bcrypt';

export const passwordUserCreateDB = async (dbConn: Connection, userObject: UserCreateObjectPassword): Promise<User> => {
    const user = new User();

    user.email = userObject.email;
    user.password = await hashPassword(userObject.password);
    user.name = userObject.name;

    return dbConn.manager.save(User, user);
};

export const findUserByEmail = async (dbConn: Connection, email: string) => {
    return dbConn.manager.findOne(User, { where: { email } });
};

export const findUserByEmailSelectPassword = async (dbConn: Connection, email: string) => {
    return dbConn.manager.findOne(User, { select: ['name', 'email', 'password', 'profile_picture'], where: { email } });
};

export const passwordUpdate = async (dbConn: Connection, user: User, newPassword: string): Promise<User> => {
    user.password = await hashPassword(newPassword);

    return dbConn.manager.save(User, user);
};
