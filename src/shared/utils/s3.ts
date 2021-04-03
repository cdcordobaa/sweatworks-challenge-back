import S3 from 'aws-sdk/clients/s3';
import path from 'path';

const s3 = new S3();

export const uploadFile = async <T>(
    file: T,
    filename: string,
    bucket: string,
    folder: string,
    contentType: string,
): Promise<string> => {
    const bucket_path = path.join(bucket, folder);

    const responseS3 = await s3
        .upload({
            Bucket: bucket_path,
            Key: filename,
            Body: file,
            ContentType: contentType,
        })
        .promise();
    return responseS3.Location;
};

export const getFile = async (bucketName: string, fileKey: string) => {
    const bucketParams = {
        Bucket: bucketName,
        Key: fileKey,
    };
    return s3.getObject(bucketParams).promise();
};

export const deleteDocument = async (fileKey: string, bucketName: string): Promise<any> => {
    const params = {
        Bucket: bucketName,
        Key: fileKey,
    };
    try {
        return await s3.deleteObject(params).promise();
    } catch (e) {
        console.log(e);
        throw e;
    }
};
