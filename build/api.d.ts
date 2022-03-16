import * as types from "./types";
import { Connection } from "./database/database";
export declare const table: <T>(table: string) => {
    select: (connection: Connection, x: Omit<types.SelectParams<T>, "from">, replacements?: types.ReplacementMap | undefined) => Promise<import("./database/database").QueryResult<T>>;
    update: (connection: Connection, x: Omit<types.UpdateParams<T>, "table">, replacements?: types.ReplacementMap | undefined) => Promise<import("./database/database").QueryResult<T>>;
    insert: (connection: Connection, x: Omit<types.InsertParams<T>, "into">, replacements?: types.ReplacementMap | undefined) => Promise<import("./database/database").QueryResult<T>>;
    remove: (connection: Connection, x: Omit<types.DeleteParams<T>, "from">, replacements?: types.ReplacementMap | undefined) => Promise<import("./database/database").QueryResult<T>>;
};
