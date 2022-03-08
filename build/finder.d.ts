import * as types from "./types";
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
export declare const typedKeys: <T extends {}>(o: T) => (keyof T)[];
export declare const isValue$Operator$Field: <T>(x: any) => x is types.Value$Operator$Field<T>;
export declare const normalizeFields: <T>(fields: types.Field<T>[]) => types.NormalizedField<T>[];
export declare const normalizeConditions: <T>(conds: types.TheCondition<T>) => types.NormalizedCondition<T>[];
export declare const finder: <T>(params: types.FindParams<T>) => (string | {
    [key: string]: any;
})[];
export declare const updater: <T>(paramsList: types.UpdateParams<T> | types.UpdateParams<T>[]) => (string | {
    [key: string]: any;
})[];
