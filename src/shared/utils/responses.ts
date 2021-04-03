import { APIGatewayProxyResult } from 'aws-lambda';

/**
 * Wraps the status code and body object in a APIGatewayProxyResult
 * @param data The body of the response, an object
 * @param statusCode The status code of the response, defaults to 200
 * @param responseCode The response code of the response to filter the error in front
 * @param error True if the response is an error
 */

export const responseHandler = (
    data: object,
    statusCode: number,
    responseCode: string,
    error: boolean = false,
): APIGatewayProxyResult => {
    return {
        statusCode,
        headers: {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        },
        body: JSON.stringify({
            data,
            notification: {
                success: error ? 'false' : 'true',
                code: responseCode,
            },
        }),
    };
};
