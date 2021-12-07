import { Injectable } from '@nestjs/common';
import AppError from '../error/app-error';
import { DatabasePool } from './database-pool';
import { DatabaseConnection } from './database-connection';

export type SelectResult<T> = Array<Array<T>>;
interface IDatabaseParams {
  database: number;
  replica?: boolean;
  ip_address?: string;
  ip_address_rr?: string;
}

@Injectable()
export class DatabaseService {
  private serverPools: { [poolAddress: string]: DatabasePool } = {};

  async connect({
    database,
    replica = false,
    ip_address,
    ip_address_rr,
  }: IDatabaseParams): Promise<DatabaseConnection> {
    if (typeof database === 'number' && database > 0) {
      const result = { ip_address: ip_address, ip_address_rr: ip_address_rr };

      const connection = await (
        await this.resolvePool(result.ip_address, result.ip_address_rr, replica)
      ).getPoolConnection(); // On the second iteration error will be thrown in this line! sayng access denied for user 'wrong user' !!

      await connection.changeDatabase({
        user: 'wrongUser',
        host: 'host',
        password: 'orWrongPass',
        database: `something${database}`,
      });
      return connection;
    }
    throw new AppError(`Cannot connect database`, 503);
  }

  getPool(poolAddress: string): DatabasePool {
    return this.serverPools[poolAddress];
  }

  private async resolvePool(
    ip_address: string,
    ip_address_rr?: string,
    replica?: boolean,
  ): Promise<DatabasePool> {
    if (!replica) {
      if (this.serverPools[ip_address]) {
        return this.serverPools[ip_address];
      }

      this.serverPools[ip_address] = await DatabasePool.create({
        port: 3306,
        host: ip_address,
        user: 'default pool user',
        password: 'default user pass',
      });

      return this.serverPools[ip_address];
    }
  }
}
