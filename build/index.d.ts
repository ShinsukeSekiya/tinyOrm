import * as types from "./types";
export * from "./types";
export declare const OP: {
    readonly EQ: "=";
    readonly NOTEQ1: "<>";
    readonly NOTEQ2: "<=>";
    readonly LT: "<";
    readonly LTE: "<=";
    readonly GT: ">";
    readonly GTE: ">=";
    readonly IS: "IS";
    readonly ISNOT: "IS_NOT";
    readonly LIKE: "LIKE";
    readonly NOTLIKE: "NOT_LIKE";
    readonly IN: "IN";
    readonly NOTIN: "NOT_IN";
    readonly BETWEEN: "BETWEEN";
    readonly NOTBETWEEN: "NOT_BETWEEN";
};
export declare const select: <T>(params: types.SelectParams<T>) => readonly [string, {
    [key: string]: any;
}];
export declare const update: <T>(paramsList: types.UpdateParams<T> | types.UpdateParams<T>[]) => [string, {
    [key: string]: any;
}];
export declare const insert: <T>(paramsList: types.InsertParams<T> | types.InsertParams<T>[]) => readonly [string, {
    [key: string]: any;
}];
export declare const remove: <T>(params: types.DeleteParams<T>) => readonly [string, {
    [key: string]: any;
}];
