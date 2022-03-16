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
export declare const select: <T>(params: types.SelectParams<T>, replacements?: types.ReplacementMap | undefined) => readonly [string, types.ReplacementMap];
export declare const update: <T>(params: types.UpdateParams<T>, replacements?: types.ReplacementMap | undefined) => [string, {
    [key: string]: any;
}];
export declare const insert: <T>(params: types.InsertParams<T>, replacements?: types.ReplacementMap | undefined) => readonly [string, types.ReplacementMap];
export declare const remove: <T>(params: types.DeleteParams<T>, replacements?: types.ReplacementMap | undefined) => readonly [string, types.ReplacementMap];
