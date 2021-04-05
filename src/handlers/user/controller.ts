import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { handlerWrapper } from '../../shared/utils/wrapper';
import { AuthResponseCodes } from '../../shared/constants/responseCodes/auth';
import { generateUserToken } from '../../shared/utils/jwt';
import { findUserByEmail, findUserByEmailSelectPassword } from './db';
import { createPasswordUser,  updatePasswordForUser } from './service';
import { verifyPassword } from '../../shared/utils/bcrypt';


export const logIn = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    return await handlerWrapper(event, async dbConn => {
        const { email, password } = JSON.parse(event.body as string);

        if (!email || !password) {
            throw {
                message: 'Fields missing, mandatory fields are: email, password',
                code: 400,
                statusCode: AuthResponseCodes.MISSING_FIELDS,
            };
        }

        const user = await findUserByEmailSelectPassword(dbConn, email);

        if (!user)
            throw {
                message: `Wrong email or password`,
                code: 401,
                statusCode: AuthResponseCodes.WRONG_EMAIL_OR_PASSWORD,
            };

        const verifiedPassword = await verifyPassword(user.password, password);

        if (!verifiedPassword)
            throw {
                message: `Wrong email or password`,
                code: 401,
                statusCode: AuthResponseCodes.WRONG_EMAIL_OR_PASSWORD,
            };

        const token = generateUserToken(user);

        return {
            data: {
                user: {
                    name: user.name,
                    email: user.email,
                    picture: user.profile_picture,
                },
                token,
            },
            code: 200,
            statusCode: AuthResponseCodes.SUCCESS_LOGIN,
        };
    });
};

export const signUp = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    return await handlerWrapper(event, async dbConn => {
        const { email, password, name } = JSON.parse(event.body as string);

        if (!email || !password || !name) {
            throw {
                message: 'Fields missing, mandatory fields are: email, password, name',
                code: 400,
                statusCode: AuthResponseCodes.MISSING_FIELDS,
            };
        }

        if (await findUserByEmail(dbConn, email))
            throw {
                message: `User with the email ${email} already exists`,
                code: 302,
                statusCode: AuthResponseCodes.ALREADY_EXISTS,
            };

        const user = await createPasswordUser(dbConn, {
            email,
            password,
            name,
        });

        const token = generateUserToken(user);

        return {
            data: {
                user: {
                    name: user.name,
                    email: user.email,
                    picture: user.profile_picture,
                },
                token,
            },
            code: 201,
            statusCode: AuthResponseCodes.SUCCESS_SIGNUP,
        };
    });
};

export const updatePassword = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    return await handlerWrapper(event, async (dbConn, token) => {
        const { password } = JSON.parse(event.body as string);

        if (!token) {
            throw {
                message: 'The jwt token is invalid',
                code: 400,
                statusCode: AuthResponseCodes.INVALID_TOKEN,
            };
        }

        if (!password) {
            throw {
                message: 'Fields missing, mandatory fields are: password',
                code: 400,
                statusCode: AuthResponseCodes.MISSING_FIELDS,
            };
        }

        await updatePasswordForUser(dbConn, token.email, password);

        return {
            data: {},
            code: 200,
            statusCode: AuthResponseCodes.PASSWORD_SUCESSFULLY_UPDATED,
        };
    });
};
