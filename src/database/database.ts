import * as mysql from "mysql";
const MySQLConnectionConfig = require("mysql/lib/ConnectionConfig");

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
    logger?: ( x: string )=>any;
}


export class Connection {
    protected connection: mysql.Connection;
    protected option: Option;
    constructor(connection: mysql.Connection, option: Option ) {
        this.connection = connection;
        this.option = option;
        if ( option.usePlaceHolderAsKeyValue === true ){
            // ":key" を 値として置き換える。
            // "@key" を フィールド名として置き換える。
            this.connection.config.queryFormat = (query, placeholders:undefined|{[key:string]:any})=>{
                if (!placeholders) return query;
                // オブジェクト{} だったら :key の置換に使う。
                const x = query.replace(/[::|:@](\w+)/g, (txt, key)=>{
                    if (placeholders.hasOwnProperty(key)) {
                        if ( txt.substr(0,1) === ":" ){
                            // 値として置き換える
                            return this.connection.escape(placeholders[key]);
                        } else if ( txt.substr(0,1) === "@" ){
                            // フィールド名として置き換える
                            return this.connection.escapeId(placeholders[key]);
                        } else {
                            throw new Error("invalid");
                        }
                    }
                    throw new Error(`database.js: "${txt}" に該当する値がplaceholdersに設定されていません。`)
                    //return txt;
                });
                return x;
            };
        }
    }
    query<T>(
        sql: string,
        placeholders?: {[key:string]:any}, 
        logging?: boolean, 
    ): Promise<QueryResult<T>> {

        return new Promise<QueryResult<T>>((resolve, reject) => {
            const q = this.connection.query(sql, placeholders, (err, result) => {
                if (err) {
                    return reject(err);
                }
                if (result instanceof Array) {
                    const rows = result.map((r) => Object.assign({}, r));
                    this.log(`database.js: result rows: ${rows.length}`, logging);
                    resolve({
                        rows,
                    });
                } else {
                    this.log(`database.js: result rows: not array, actual ${typeof result}.`, logging);
                    resolve({
                        okPacket: {
                            affectedRows: result.affectedRows,
                            insertId: result.insertId,
                        },
                        rows: [],
                    });
                }
                // (this.connection as any).off("enqueue", logHandler);
            });
            this.log(q.sql, logging);
        });
    };

    //
    //  ログ出力。
    //
    log( message: string, logging?: boolean ){
        const logger = this.option.logger || console.log;
        if ( logging === true ) {
            logger(`database.js: ${message}`);
        } else if ( logging === undefined && this.option.logging === true ) {
            logger(`database.js: ${message}`);
        }
    }
}


export class Transaction extends Connection {
    finished: boolean;
    constructor(connection: mysql.Connection, option: Option) {
        super(connection, option);
        this.finished = false;
    }
    query<T>(
        sql: string, 
        placeholders: {[key:string]:any} = {}, 
        logging: boolean = false, 
    ): Promise<QueryResult<T>> {
        if (this.finished) {
            return Promise.reject(new Error("transaction already closed"));
        }
        return super.query(sql, placeholders, logging);
    }
    commit(): Promise<void> {
        if (this.finished) {
            return Promise.resolve();
        }
        this.finished = true;
        return new Promise<void>((resolve, reject) => {
            this.connection.commit((err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
    rollback(): Promise<void> {
        if (this.finished) {
            return Promise.resolve();
        }
        this.finished = true;
        return new Promise<void>((resolve, reject) => {
            this.connection.rollback((err) => {
                if (err) {
                    return reject();
                }
                resolve();
            });
        });
    }
}

export class Database {
    private pool: mysql.Pool;
    private option: Option;
    constructor( config: MySQLConfig, option: Option = {} ) {
        this.option = option;
        const c = (() => {
            if ( config.url ) {
                return MySQLConnectionConfig.parseUrl(config.url);
            } else {
                return config;
            }
        })();
        this.pool = mysql.createPool(Object.assign({}, c, { 
            supportBigNumbers: true, 
            bigNumberStrings: true,
            typeCast: function(field:any, next:any) {
                //if (field.name=="myalias") console.log("field==>", field);
                if (field.type === 'TINY' && field.length === 1) {
                    return field.string() === '1'; // '1' = true, '0' = false
                }
                
                return next();
            }
        }));
    }
    async transaction<T>(callback: (transaction: Transaction) => Promise<T>, option?: Option ): Promise<T> {
        const conn = await this.getConnection();
        await this.beginTransaction(conn);
        const transaction = new Transaction(conn, option || this.option);
        try {
            const result = await callback(transaction);
            await transaction.commit();
            return result;
        } catch (e) {
            await transaction.rollback();
            throw e;
        } finally {
            conn.release();
        }
    }
    async connection<T>(callback: (connection: Connection ) => Promise<T>, option?: Option ): Promise<T> {
        const conn = await this.getConnection();
        try {
            return await callback(new Connection(conn, option || this.option));
        } finally {
            conn.release();
        }
    }
    private beginTransaction(conn: mysql.PoolConnection): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            conn.beginTransaction((err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
    private getConnection(): Promise<mysql.PoolConnection> {
        return new Promise<mysql.PoolConnection>((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    return reject(err);
                }
                return resolve(connection);
            });
        });
    }
    release(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.pool.end((err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
    getConfig() {
        // 確認用にConfigを取得
        return this.pool.config.connectionConfig;
    }
}

export async function bulkInsert(conn: Connection, tableName: string, data: any[]): Promise<void> {
    if (!data.length) {
        return;
    }
    const cols = Object.keys(data[0]);
    if (!cols.length) {
        return;
    }
    const values = data.map((d) => {
        return cols.map((c) => d[c]);
    });
    const sql = `insert into ${tableName} (${cols.map((c) => "`" + c + "`").join(",")}) values ?`;
    await conn.query(sql, [values]);
}
