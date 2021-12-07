import { InternalServerErrorException } from '@nestjs/common';
import { PoolConnection } from 'mysql2/promise';
import { ConnectionOptions } from 'mysql2/typings/mysql';
import { CustomQuery } from './custom-query';
import { IError } from './interfaces/error';

export class DatabaseConnection extends CustomQuery {
  constructor(private readonly poolConnection: PoolConnection) {
    super(poolConnection);
    this.poolConnection.on('error', this.handleError.bind(this));
  }

  get nativeConnection() {
    return this.poolConnection;
  }

  private async handleError(err: IError) {
    if (err.fatal) {
      this.nativeConnection.destroy(); // destroying connection here does not prevent the pool from trying with same credentials on getConnection()...
      // this.nativeConnection.release(); // ...releasing, however does prevent! so it fixes my issue, but i still think the pool shouldn't have this behaviour in any case
    }
    //throw new InternalServerErrorException(err); //let's do nothing so we can try again on connection 2 only for this test, but on a real case this would stop de endpoint from going further and a new call would break again
  }
  async release() {
    this.nativeConnection.release();
  }

  async destroy() {
    this.nativeConnection.destroy();
  }

  async beginTransaction() {
    await this.nativeConnection.beginTransaction();
  }

  async changeDatabase(options: ConnectionOptions) {
    try {
      await this.nativeConnection.changeUser(options);
    } catch (error) {
      // Connection compromised needs to be taken of the pool
      error.fatal = true;
      await this.handleError(error);
    }
  }

  // Factory methods
  static async create(
    poolConnection: PoolConnection,
  ): Promise<DatabaseConnection> {
    return new DatabaseConnection(poolConnection);
  }
}
