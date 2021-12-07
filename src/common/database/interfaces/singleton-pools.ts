import { DatabasePool } from '../database-pool';

export interface ISingletonPools {
  geral: DatabasePool;
  geral_rr: DatabasePool;
}
