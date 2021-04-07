import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { handlerWrapper } from '../../shared/utils/wrapper';
import { Publication } from '../../entities/Publication';
import { PublicationResponseCodes as ResCodes } from '../../shared/constants/responseCodes/publication';
import {
    getPublications,
    createPublicationDB,
    findPublicationByTitle,
    updatePublicationById,
    getPublicationById,
    deletePublicationById,
} from './db';
import { PublicationType } from '../../shared/types/publication';
import { objToCamel } from '../../shared/utils/tranformers';
import { Author } from '../../entities/Author';

export const getAllPublications = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    return await handlerWrapper(event, async dbConn => {
        const publications: Publication[] = await getPublications(dbConn);
        return {
            data: {
                publications: publications.map(atr => objToCamel(atr)),
            },
            code: 200,
            statusCode: ResCodes.SUCCESS_GETALL,
        };
    });
};

export const createPublication = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    return await handlerWrapper(event, async dbConn => {
        const { title, body, picture, publicationDate, authorsIds } = JSON.parse(event.body as string);

        const publication: PublicationType = {
            title,
            body,
            picture,
            publicationDate,
            authorsIds,
        };
        if (await findPublicationByTitle(dbConn, title)) {
            throw {
                message: `Publication with the title ${title} already exists`,
                code: 302,
                statusCode: ResCodes.ALREADY_EXISTS,
            };
        }
        const dbPublication: Publication | undefined = await createPublicationDB(dbConn, publication);
        if (!dbPublication) {
            throw {
                message: `publication not created`,
                code: 502,
                statusCode: ResCodes.ALREADY_EXISTS,
            };
        }

        return {
            data: {
                publication: {
                    ...objToCamel(dbPublication),
                    authorsIds: dbPublication.authors?.map(author => author.id),
                },
            },
            code: 200,
            statusCode: ResCodes.PUBLICATION_CREATED,
        };
    });
};

export const getPublication = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    return await handlerWrapper(event, async dbConn => {
        const id = event.pathParameters?.id;
        if (!id) {
            throw {
                message: `incorrect path or params`,
                code: 302,
                statusCode: ResCodes.ERROR_PATH,
            };
        }

        const publication = await getPublicationById(dbConn, id);
        if (!publication) {
            throw {
                message: `Publication do not exists`,
                code: 402,
                statusCode: ResCodes.PUBLICATION_NOT_EXIST,
            };
        }
        return {
            data: {
                publication: { ...objToCamel(publication), authorsIds: publication.authors?.map(author => author.id) },
            },
            code: 200,
            statusCode: ResCodes.SUCCESS_GET_PUBL,
        };
    });
};

export const updatePublication = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    return await handlerWrapper(event, async dbConn => {
        const { title, body, picture, publicationDate, authorsIds } = JSON.parse(event.body as string);
        const id = event.pathParameters?.id;
        if (!id) {
            throw {
                message: `incorrect path or params`,
                code: 302,
                statusCode: ResCodes.ERROR_PATH,
            };
        }

        const publication: PublicationType = {
            title,
            body,
            picture,
            publicationDate,
            authorsIds,
        };
        const updatedPublication: Publication | undefined = await updatePublicationById(dbConn, publication, id);
        if (!updatedPublication) {
            throw {
                message: `Publication do not exists`,
                code: 302,
                statusCode: ResCodes.ALREADY_EXISTS,
            };
        }
        return {
            data: {
                publication: {
                    ...objToCamel(updatedPublication),
                    authorsIds: updatedPublication.authors?.map(author => author.id),
                },
            },
            code: 200,
            statusCode: ResCodes.PUBLICATION_UPDATED,
        };
    });
};

export const deletePublication = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    return await handlerWrapper(event, async dbConn => {
        const id = event.pathParameters?.id;

        if (!id) {
            throw {
                message: `incorrect path or params`,
                code: 302,
                statusCode: ResCodes.ERROR_PATH,
            };
        }
        const deletedPublication = await deletePublicationById(dbConn, id);
        if (!deletedPublication) {
            throw {
                message: `Publication do not exists`,
                code: 402,
                statusCode: ResCodes.PUBLICATION_NOT_EXIST,
            };
        }
        return {
            data: {
                publication: deletedPublication,
            },
            code: 200,
            statusCode: ResCodes.SUCCESS_DELTED_PUBL,
        };
    });
};
