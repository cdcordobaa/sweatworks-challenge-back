import { Connection } from 'typeorm';
import { AuthorType } from '../../shared/types/author';
import { Author } from '../../entities/Author';
import { objToSnake } from '../../shared/utils/tranformers';

export const getAuthors = async (dbConn: Connection): Promise<Author[]> => {
    return dbConn.manager.getRepository(Author).find();
};

export const getAuthorById = async (dbConn: Connection, id: string): Promise<Author | undefined> => {
    return dbConn.manager.getRepository(Author).findOne({ where: { id } });
};

export const updateAuthorById = async (
    dbConn: Connection,
    author: Partial<AuthorType>,
    id: string,
): Promise<Author | undefined> => {
    let existingAuthor: Author | undefined = await dbConn.manager.getRepository(Author).findOne({ where: { id } });
    if (!existingAuthor) return undefined;

    const incomingAuthor = objToSnake(author);
    for (let key in incomingAuthor) {
        const value = incomingAuthor[key];
        if (value) {
            existingAuthor[key] = value;
        }
    }
    return dbConn.manager.save(Author, existingAuthor);
};

export const createAuthorDB = async (dbConn: Connection, author: AuthorType): Promise<Author> => {
    const authorRepository = dbConn.manager.getRepository(Author);
    const newAuthor = authorRepository.create(objToSnake(author));
    return authorRepository.save(newAuthor);
};

export const findAuthorByEmail = async (dbConn: Connection, email: string): Promise<Author | undefined> => {
    return dbConn.manager.findOne(Author, { where: { email } });
};

export const deleteAuthorById = async (dbConn: Connection, id: string): Promise<Author | undefined> => {
    let existingAuthor: Author | undefined = await dbConn.manager.getRepository(Author).findOne({ where: { id } });
    if (!existingAuthor) return undefined;
    return dbConn.manager.getRepository(Author).remove(existingAuthor);
};
