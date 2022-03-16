import mysql from "mysql";
export declare const connection: mysql.Connection;
export declare const query: <T = any>(sql: string, replacements?: any, logging?: boolean | undefined) => Promise<T[]>;
export declare const dropTables: () => Promise<unknown>;
export declare const createTales: () => Promise<unknown>;
