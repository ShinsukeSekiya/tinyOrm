import * as types from "./types";
export declare const typedKeys: <T extends {}>(o: T) => (keyof T)[];
export declare const isObject: (x: any) => x is object;
export declare class Replacer {
    idx: number;
    map: {
        [key: string]: any;
    };
    constructor();
    field(value: any): string;
    value(value: any): string;
}
export declare const isValue$Operator$Field: <T>(x: any) => x is types.Value$Operator$Field<T>;
export declare const normalizeFields: <T>(fields: types.Field<T>[]) => types.NormalizedField<T>[];
export declare const normalizeConditions: <T>(conds: types.TheCondition<T>) => types.NormalizedCondition<T>[];
export declare const renderCondition: <T>(_cs: types.NormalizedCondition<T>[], replacer: Replacer) => string;
export declare const renderSet: <T>(set: types.TSet<T>, replacer: Replacer) => string;
