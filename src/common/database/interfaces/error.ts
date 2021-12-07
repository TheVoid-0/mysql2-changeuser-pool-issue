export interface IError {
  code: string;
  errno: number;
  fatal: boolean;
  sql: string;
  sqlState: string;
  sqlMessage: string;
}
