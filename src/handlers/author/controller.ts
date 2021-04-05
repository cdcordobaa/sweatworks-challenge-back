import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { handlerWrapper } from '../../shared/utils/wrapper';
import { AuthorResponseCodes as ResCodes } from '../../shared/constants/responseCodes/author';
import { generateUserToken } from '../../shared/utils/jwt';
import { getAuthors, createAuthorDB, findAuthorByEmail } from './db';
import { verifyPassword } from '../../shared/utils/bcrypt';
import { AuthorType } from '../../shared/types/author';
import { objToSnake, objToCamel } from '../../shared/utils/tranformers';

export const getAllAuthors = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    return await handlerWrapper(event, async dbConn => {
        const authors = await getAuthors(dbConn);

        return {
            data: {
                authors: authors.map(atr => objToCamel(atr)),
            },
            code: 200,
            statusCode: ResCodes.SUCCESS_GETALL,
        };
    });
};

export const createAuthor = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    return await handlerWrapper(event, async dbConn => {
        const { firstName, lastName, email, birthDate } = JSON.parse(event.body as string);

        const author: AuthorType = {
            firstName,
            lastName,
            email,
            birthDate,
        };

        if (await findAuthorByEmail(dbConn, email)) {
            throw {
                message: `Author with the email ${email} already exists`,
                code: 302,
                statusCode: ResCodes.ALREADY_EXISTS,
            };
        }

        const dbAuthor = await createAuthorDB(dbConn, author);
        return {
            data: {
                author: objToCamel(dbAuthor),
            },
            code: 200,
            statusCode: ResCodes.AUTHOR_CREATED,
        };
    });
};

export const getAuthor = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    return await handlerWrapper(event, async dbConn => {
        const { email, password } = JSON.parse(event.body as string);

        return {
            data: {
                author: {},
            },
            code: 200,
            statusCode: ResCodes.SUCCESS_GETALL,
        };
    });
};

export const updateAuthor = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    return await handlerWrapper(event, async dbConn => {
        const { email, password } = JSON.parse(event.body as string);

        return {
            data: {
                author: {},
            },
            code: 200,
            statusCode: ResCodes.SUCCESS_GETALL,
        };
    });
};

export const deleteAuthor = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    return await handlerWrapper(event, async dbConn => {
        const { email, password } = JSON.parse(event.body as string);

        return {
            data: {
                author: {},
            },
            code: 200,
            statusCode: ResCodes.SUCCESS_GETALL,
        };
    });
};
