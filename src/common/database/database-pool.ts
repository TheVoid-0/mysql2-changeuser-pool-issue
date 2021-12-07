import { createPool, Pool, PoolOptions } from 'mysql2/promise';
import { CustomQuery } from './custom-query';
import { DatabaseConnection } from './database-connection';

export class DatabasePool extends CustomQuery {
  constructor(private readonly pool: Pool) {
    super(pool);
  }

  get nativePool() {
    return this.pool;
  }

  async end() {
    return await this.nativePool.end();
  }

  async getPoolConnection() {
    return DatabaseConnection.create(await this.nativePool.getConnection());
  }

  // Factory methods
  static async create(connectionOptions: PoolOptions): Promise<DatabasePool> {
    return new DatabasePool(createPool(connectionOptions));
  }
}
