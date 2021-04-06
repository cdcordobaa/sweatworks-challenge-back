import { Connection, ConnectionManager, ConnectionOptions, DefaultNamingStrategy, getConnectionManager, createConnection } from 'typeorm';
import { RelationIdLoader } from 'typeorm/query-builder/RelationIdLoader';
import { RelationLoader } from 'typeorm/query-builder/RelationLoader';
import config from '../../ormconfig';

/**
 * Database manager class
 */



export class Database {
    private connectionManager: ConnectionManager;

    private config: ConnectionOptions;

    constructor() {
        this.config = config;
    }

    /**
     * Injects missing / outdated connection options into an existing database
     * connection.
     *
     * @see https://github.com/typeorm/typeorm/issues/3427
     * @returns {Connection}
     */
    private injectConnectionOptions(): Connection {
        const connection = this.connectionManager.get();
        // @ts-ignore
        connection.options = this.config;
        // @ts-ignore
        connection.manager = connection.createEntityManager();
        // @ts-ignore
        connection.namingStrategy = connection.options.namingStrategy || new DefaultNamingStrategy();
        // @ts-ignore
        connection.relationLoader = new RelationLoader(connection);
        // @ts-ignore
        connection.relationIdLoader = new RelationIdLoader(connection);
        // @ts-ignore
        connection.buildMetadatas();

        return connection;
    }

    public async getConnection(): Promise<Connection> {
        try {
            console.log('Establishing connection...');
            this.connectionManager = getConnectionManager();
            let connection: Connection;

            if (this.connectionManager.has('default') && this.connectionManager.get('default').isConnected) {
                console.log('Reusing connection...');
                connection = this.injectConnectionOptions();
            } else {
                console.log('Creating new connection...');
                connection = this.connectionManager.create(config);
                await connection.connect();
            }
            console.log('Connection established');
            return connection;
        } catch (e) {
            console.error(e);
            throw e;
        }

    }

    public async getEmptyDataConnection(): Promise<Connection> {
        if (process.env.IS_TEST === 'test') {
            const connection: Connection = await this.getConnection();
            await connection.synchronize(true);
            return connection;
        }
        throw 'getEmptyDataConnection is only avalible for test';
    }
}
