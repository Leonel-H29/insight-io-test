import mysql, { Pool } from 'mysql2/promise';
export class MySqlClient {
  readonly pool: Pool;
  constructor(url: string) {
    this.pool = mysql.createPool(url);
  }
  async close(): Promise<void> {
    await this.pool.end();
  }
}
