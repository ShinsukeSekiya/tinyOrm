import * as types from "./types";
import { Connection } from "./database/database";
export declare const table: <T>(table: string) => {
    select: (x: Omit<types.SelectParams<T>, "from">, connection: Connection) => Promise<import("./database/database").QueryResult<T>>;
    update: (x: Omit<types.UpdateParams<T>, "table">, connection: Connection) => Promise<import("./database/database").QueryResult<T>>;
    insert: (x: Omit<types.InsertParams<T>, "into">, connection: Connection) => Promise<import("./database/database").QueryResult<T>>;
    remove: (x: Omit<types.DeleteParams<T>, "from">, connection: Connection) => Promise<import("./database/database").QueryResult<T>>;
};
