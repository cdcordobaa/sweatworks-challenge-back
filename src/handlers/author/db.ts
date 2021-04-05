import { Connection } from 'typeorm';
import { AuthorType } from '../../shared/types/author';
import { Author } from '../../entities/Author';
import { objToSnake, objToCamel } from '../../shared/utils/tranformers';

export const getAuthors = async (dbConn: Connection): Promise<Author[]> => {
    return dbConn.manager.createQueryBuilder(Author, 'author').getMany();
};

export const createAuthorDB = async (dbConn: Connection, author: AuthorType): Promise<Author> => {
    const authorRepository = dbConn.manager.getRepository(Author);

    const newAuthor = authorRepository.create(objToSnake(author));

    return authorRepository.save(newAuthor);
};

export const findAuthorByEmail = async (dbConn: Connection, email: string) => {
    return dbConn.manager.findOne(Author, { where: { email } });
};
