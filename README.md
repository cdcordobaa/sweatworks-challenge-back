# sweatworks-challenge

Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `ormconfig.json` file or check the default values
3. Run `npm run start:dev` command


##Migrations

To create migrations: 

`npx ts-node ./node_modules/typeorm/cli -f src/ormconfig.ts  migration:generate -n {MigrationName}`

To run migrations: 

`npx ts-node ./node_modules/typeorm/cli -f src/ormconfig.ts  migration:run`