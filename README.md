Testing the issue:

yarn install

yarn start:dev

use the localhost:3005/ping/test endpoint

provide a host and database to databaseService.connect method.

The relevant code lies in common/database/database.servicets and common/database/database-connection.ts