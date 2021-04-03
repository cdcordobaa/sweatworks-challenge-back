import { ConnectionOptions } from 'typeorm';

const config: ConnectionOptions = {
    name: 'default',
    type: 'postgres',
    port: 5432,
    synchronize: true, // Use true for local development
    migrationsRun: true,
    logging: true,
    host: process.env.DB_HOST || 'localhost',
    username: process.env.DB_USERNAME || 'postgres',
    database: process.env.DB_NAME || 'sweatworks',
    password: process.env.DB_PASSWORD || 'postgres',
    entities: ['build/entities/*.js'],
    cli: {
        entitiesDir: 'build/entities',
        migrationsDir: 'src/migrations',
        subscribersDir: 'build/subscriber',
    },
    migrations: ['build/migrations/*.js'],
};

// export = config; // Use to generate new migrations
export default config;
