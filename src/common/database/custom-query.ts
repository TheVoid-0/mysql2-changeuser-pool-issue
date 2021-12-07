import { PoolConnection, Pool, OkPacket } from 'mysql2/promise';

export class CustomQuery {
  constructor(private readonly native: PoolConnection | Pool) {}
  async selectQuery<T>(sql: string, params?: Array<any>): Promise<Array<T>> {
    return (await this.native.query(sql, params))[0] as unknown as Array<T>;
  }

  async selectFirst<T>(sql: string, params?: Array<any>): Promise<T> {
    return (
      (await this.native.query(sql, params))[0] as unknown as Array<T>
    )[0];
  }

  /**
   *
   * @returns id do item inserido
   */
  async insertOne(sql: string, params?: Array<any>): Promise<number> {
    return ((await this.native.query(sql, params)) as unknown as OkPacket[])[0]
      .insertId;
  }

  async insert(sql: string, params?: Array<any>) {
    return (await this.native.query(sql, params)) as unknown as OkPacket[];
  }

  /**
   *
   * @returns o número de colunas afetadas
   */
  async updateQuery(sql: string, params?: Array<any>): Promise<number> {
    return ((await this.native.query(sql, params)) as unknown as OkPacket[])[0]
      .affectedRows;
  }

  async query(sql: string, params?: Array<any>) {
    return await this.native.query(sql, params ? params : []);
  }
}
