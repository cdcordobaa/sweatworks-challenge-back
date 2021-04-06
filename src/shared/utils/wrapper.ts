import * as lambda from 'aws-lambda';
import { Connection } from 'typeorm';
import { DecodedToken } from '../types/auth';
import { ResponseObject } from '../types/response';
import { Database } from './db';
import { decodeToken } from './jwt';
import { responseHandler } from './responses';

const database = new Database();

export const handlerWrapper = async <T>(
    event: lambda.APIGatewayProxyEvent,
    operation: (connection: Connection, decodeToken?: DecodedToken) => Promise<ResponseObject>,
): Promise<lambda.APIGatewayProxyResult> => {
    try {
        const connection: Connection = await database.getConnection();
        let res: ResponseObject;
        if (event.headers.Authorization) {
            const decodedToken = decodeToken(event.headers);
            res = await operation(connection, decodedToken);
        } else {
            res = await operation(connection);
        }
        return responseHandler(res.data, res.code, res.statusCode, res.error);
    } catch (e) {
        console.error(`Operation ${operation.name} threw `, e);
        return responseHandler(e.message ? e.message : e, e.code ? e.code : 500, e.statusCode, true);
    }
};
