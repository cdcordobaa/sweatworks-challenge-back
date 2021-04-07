import { Connection } from 'typeorm';
import { PublicationType } from '../../shared/types/publication';
import { Publication } from '../../entities/Publication';
import { objToSnake } from '../../shared/utils/tranformers';
import { Author } from '../../entities/Author';

export const getPublications = async (dbConn: Connection): Promise<Publication[]> => {
    return dbConn.manager.getRepository(Publication).find();
};

export const getPublicationById = async (dbConn: Connection, id: string): Promise<Publication | undefined> => {
    return dbConn.manager.getRepository(Publication).findOne({ where: { id }, relations: ['authors'] });
};

export const updatePublicationById = async (
    dbConn: Connection,
    publication: Partial<PublicationType>,
    id: string,
): Promise<Publication | undefined> => {
    let existingPublication: Publication | undefined = await dbConn.manager
        .getRepository(Publication)
        .findOne({ where: { id } });
    if (!existingPublication) return undefined;

    const incomingPublication = objToSnake(publication);
    for (let key in incomingPublication) {
        const value = incomingPublication[key];
        if (value) {
            existingPublication[key] = value;
        }
    }

    if (publication.authorsIds?.length) {
        const results = await Promise.all(
            publication.authorsIds.map(id => dbConn.manager.findOne(Author, { where: { id } })),
        );

        if (!results) {
            return undefined;
        }
        existingPublication.authors = results as Author[];
    }
    return dbConn.manager.save(Publication, existingPublication);
};

export const createPublicationDB = async (
    dbConn: Connection,
    publication: PublicationType,
): Promise<Publication | undefined> => {
    const publicationRepository = dbConn.manager.getRepository(Publication);
    const newPublication = publicationRepository.create(objToSnake(publication));
    if (publication.authorsIds?.length) {
        const results = await Promise.all(
            publication.authorsIds.map(id => dbConn.manager.findOne(Author, { where: { id } })),
        );

        if (!results) {
            return undefined;
        }

        newPublication.authors = results as Author[];
    }
    return publicationRepository.save(newPublication);
};

export const findPublicationByTitle = async (dbConn: Connection, title: string): Promise<Publication | undefined> => {
    return dbConn.manager.findOne(Publication, { where: { title } });
};

export const deletePublicationById = async (dbConn: Connection, id: string): Promise<Publication | undefined> => {
    let existingPublication: Publication | undefined = await dbConn.manager
        .getRepository(Publication)
        .findOne({ where: { id } });
    console.log('the found thing', existingPublication);
    if (!existingPublication) return undefined;
    return dbConn.manager.softRemove(existingPublication);
};
