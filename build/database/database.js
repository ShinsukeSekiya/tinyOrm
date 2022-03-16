"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkInsert = exports.Database = exports.Transaction = exports.Connection = void 0;
const mysql = __importStar(require("mysql"));
const MySQLConnectionConfig = require("mysql/lib/ConnectionConfig");
class Connection {
    constructor(connection, option) {
        this.connection = connection;
        this.option = option;
        if (option.usePlaceHolderAsKeyValue === true) {
            // ":key" を 値として置き換える。
            // "@key" を フィールド名として置き換える。
            this.connection.config.queryFormat = (query, placeholders) => {
                if (!placeholders)
                    return query;
                // オブジェクト{} だったら :key の置換に使う。
                const x = query.replace(/[::|:@](\w+)/g, (txt, key) => {
                    if (placeholders.hasOwnProperty(key)) {
                        if (txt.substr(0, 1) === ":") {
                            // 値として置き換える
                            return this.connection.escape(placeholders[key]);
                        }
                        else if (txt.substr(0, 1) === "@") {
                            // フィールド名として置き換える
                            return this.connection.escapeId(placeholders[key]);
                        }
                        else {
                            throw new Error("invalid");
                        }
                    }
                    throw new Error(`database.js: "${txt}" に該当する値がplaceholdersに設定されていません。`);
                    //return txt;
                });
                return x;
            };
        }
    }
    query(sql, placeholders, logging) {
        return new Promise((resolve, reject) => {
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
                }
                else {
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
    }
    ;
    //
    //  ログ出力。
    //
    log(message, logging) {
        const logger = this.option.logger || console.log;
        if (logging === true) {
            logger(`database.js: ${message}`);
        }
        else if (logging === undefined && this.option.logging === true) {
            logger(`database.js: ${message}`);
        }
    }
}
exports.Connection = Connection;
class Transaction extends Connection {
    constructor(connection, option) {
        super(connection, option);
        this.finished = false;
    }
    query(sql, placeholders = {}, logging = false) {
        if (this.finished) {
            return Promise.reject(new Error("transaction already closed"));
        }
        return super.query(sql, placeholders, logging);
    }
    commit() {
        if (this.finished) {
            return Promise.resolve();
        }
        this.finished = true;
        return new Promise((resolve, reject) => {
            this.connection.commit((err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
    rollback() {
        if (this.finished) {
            return Promise.resolve();
        }
        this.finished = true;
        return new Promise((resolve, reject) => {
            this.connection.rollback((err) => {
                if (err) {
                    return reject();
                }
                resolve();
            });
        });
    }
}
exports.Transaction = Transaction;
class Database {
    constructor(config, option = {}) {
        this.option = option;
        const c = (() => {
            if (config.url) {
                return MySQLConnectionConfig.parseUrl(config.url);
            }
            else {
                return config;
            }
        })();
        this.pool = mysql.createPool(Object.assign({}, c, {
            supportBigNumbers: true,
            bigNumberStrings: true,
            typeCast: function (field, next) {
                //if (field.name=="myalias") console.log("field==>", field);
                if (field.type === 'TINY' && field.length === 1) {
                    return field.string() === '1'; // '1' = true, '0' = false
                }
                return next();
            }
        }));
    }
    async transaction(callback, option) {
        const conn = await this.getConnection();
        await this.beginTransaction(conn);
        const transaction = new Transaction(conn, option || this.option);
        try {
            const result = await callback(transaction);
            await transaction.commit();
            return result;
        }
        catch (e) {
            await transaction.rollback();
            throw e;
        }
        finally {
            conn.release();
        }
    }
    async connection(callback, option) {
        const conn = await this.getConnection();
        try {
            return await callback(new Connection(conn, option || this.option));
        }
        finally {
            conn.release();
        }
    }
    beginTransaction(conn) {
        return new Promise((resolve, reject) => {
            conn.beginTransaction((err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
    getConnection() {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    return reject(err);
                }
                return resolve(connection);
            });
        });
    }
    release() {
        return new Promise((resolve, reject) => {
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
exports.Database = Database;
async function bulkInsert(conn, tableName, data) {
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
exports.bulkInsert = bulkInsert;
