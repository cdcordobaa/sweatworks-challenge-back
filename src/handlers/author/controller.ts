import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { handlerWrapper } from '../../shared/utils/wrapper';
import { Author } from '../../entities/Author';
import { AuthorResponseCodes as ResCodes } from '../../shared/constants/responseCodes/author';
import { getAuthors, createAuthorDB, findAuthorByEmail, updateAuthorById, getAuthorById, deleteAuthorById } from './db';
import { AuthorType } from '../../shared/types/author';
import { objToCamel } from '../../shared/utils/tranformers';

export const getAllAuthors = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    return await handlerWrapper(event, async dbConn => {
        const authors: Author[] = await getAuthors(dbConn);
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
        const { firstName, lastName, email, birthDate, photo } = JSON.parse(event.body as string);

        const author: AuthorType = {
            firstName,
            lastName,
            email,
            birthDate,
            photo,
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
        const id = event.pathParameters?.id;
        if (!id) {
            throw {
                message: `incorrect path or params`,
                code: 302,
                statusCode: ResCodes.ERROR_PATH,
            };
        }

        const author = await getAuthorById(dbConn, id);
        if (!author) {
            throw {
                message: `Author do not exists`,
                code: 402,
                statusCode: ResCodes.AUTHOR_NOT_EXIST,
            };
        }
        return {
            data: {
                author: author,
            },
            code: 200,
            statusCode: ResCodes.SUCCESS_GET_AUTHR,
        };
    });
};

export const updateAuthor = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    return await handlerWrapper(event, async dbConn => {
        const { firstName, lastName, email, birthDate, photo } = JSON.parse(event.body as string);
        const id = event.pathParameters?.id;
        if (!id) {
            throw {
                message: `incorrect path or params`,
                code: 302,
                statusCode: ResCodes.ERROR_PATH,
            };
        }

        const author: Partial<AuthorType> = {
            firstName,
            lastName,
            email,
            birthDate,
            photo,
        };
        const updatedAuthor: Author | undefined = await updateAuthorById(dbConn, author, id);
        if (!updatedAuthor) {
            throw {
                message: `Author do not exists`,
                code: 302,
                statusCode: ResCodes.ALREADY_EXISTS,
            };
        }
        return {
            data: {
                author: updatedAuthor,
            },
            code: 200,
            statusCode: ResCodes.AUTHOR_UPDATED,
        };
    });
};

export const deleteAuthor = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    return await handlerWrapper(event, async dbConn => {
        const id = event.pathParameters?.id;

        if (!id) {
            throw {
                message: `incorrect path or params`,
                code: 302,
                statusCode: ResCodes.ERROR_PATH,
            };
        }
        const deletedAuthor = await deleteAuthorById(dbConn, id);
        if (!deletedAuthor) {
            throw {
                message: `Author do not exists`,
                code: 402,
                statusCode: ResCodes.AUTHOR_NOT_EXIST,
            };
        }
        return {
            data: {
                author: deletedAuthor,
            },
            code: 200,
            statusCode: ResCodes.SUCCESS_DELTED_AUTHR,
        };
    });
};
