import * as mysql from "mysql";
export interface MySQLConfig {
    database?: string;
    user?: string;
    password?: string;
    host?: string;
    port?: number;
    url?: string;
    timezone?: string;
}
export interface OKPacket {
    affectedRows: number;
    insertId: number | string;
}
export interface QueryResult<T> {
    rows: T[];
    okPacket?: OKPacket;
}
export interface Option {
    usePlaceHolderAsKeyValue?: boolean;
    logging?: boolean;
    logger?: (x: string) => any;
}
export declare class Connection {
    protected connection: mysql.Connection;
    protected option: Option;
    constructor(connection: mysql.Connection, option: Option);
    query<T>(sql: string, placeholders?: {
        [key: string]: any;
    }, logging?: boolean): Promise<QueryResult<T>>;
    log(message: string, logging?: boolean): void;
}
export declare class Transaction extends Connection {
    finished: boolean;
    constructor(connection: mysql.Connection, option: Option);
    query<T>(sql: string, placeholders?: {
        [key: string]: any;
    }, logging?: boolean): Promise<QueryResult<T>>;
    commit(): Promise<void>;
    rollback(): Promise<void>;
}
export declare class Database {
    private pool;
    private option;
    constructor(config: MySQLConfig, option?: Option);
    transaction<T>(callback: (transaction: Transaction) => Promise<T>, option?: Option): Promise<T>;
    connection<T>(callback: (connection: Connection) => Promise<T>, option?: Option): Promise<T>;
    private beginTransaction;
    private getConnection;
    release(): Promise<void>;
    getConfig(): mysql.ConnectionConfig;
}
export declare function bulkInsert(conn: Connection, tableName: string, data: any[]): Promise<void>;
