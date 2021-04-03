import 'reflect-metadata';
import { APIGatewayEvent } from 'aws-lambda';

export const handshake = async (event: APIGatewayEvent): Promise<any> => {
    return {
        statusCode: 200,
        body: 'API Handshake',
    };
};
