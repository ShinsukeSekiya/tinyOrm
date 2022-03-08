import { OP } from ".";
export declare type SelectParams<T> = {
    from: string;
    fields: Field<T>[] | string;
    where?: TheCondition<T> | string;
    offset?: number;
    limit?: number;
    orderBy?: OrderBy<T>;
    grouBy?: (keyof T)[];
    having?: TheCondition<T> | string;
};
export declare type UpdateParams<T> = {
    table: string;
    set: {
        [FIELD in keyof T]?: T[FIELD];
    };
    where: TheCondition<T> | string;
};
export declare type InsertParams<T> = {
    into: string;
    set: {
        [FIELD in keyof T]?: T[FIELD];
    };
};
export declare type DeleteParams<T> = {
    from: string;
    where: TheCondition<T> | string;
};
export declare type Field<T> = keyof T | "*" | {
    [as: string]: string;
};
export declare type NormalizedField<T> = {
    type: "NORMAL";
    field: keyof T;
} | {
    type: "ASTARISK";
} | {
    type: "LITERAL";
    alies: string;
    statement: string;
};
export declare type OrderBy<T> = {
    [FIELD in keyof T]?: "DESC" | "ASC";
};
export declare type TheCondition<T> = Value$Operator$Field<T> | "OR" | "AND" | string | TheCondition<T>[];
export declare type Value$Operator$Field<T> = {
    [FIELD in keyof T]?: Value$Operator<T, FIELD>;
};
export declare type Value$Operator<T, FIELD extends keyof T> = Partial<{
    [OP.EQ]: T[FIELD];
    [OP.NOTEQ1]: T[FIELD];
    [OP.NOTEQ2]: T[FIELD];
    [OP.LT]: T[FIELD];
    [OP.LTE]: T[FIELD];
    [OP.GT]: T[FIELD];
    [OP.GTE]: T[FIELD];
    [OP.IS]: T[FIELD];
    [OP.ISNOT]: T[FIELD];
    [OP.LIKE]: T[FIELD];
    [OP.NOTLIKE]: T[FIELD];
    [OP.IN]: T[FIELD][];
    [OP.NOTIN]: T[FIELD][];
    [OP.BETWEEN]: T[FIELD][];
    [OP.NOTBETWEEN]: T[FIELD][];
}>;
export declare type NormalizedCondition<T> = {
    type: "VALUE$OPERATOR$FIELD";
    field: keyof T;
    operator: typeof OP[keyof typeof OP];
    value: T[keyof T] | T[keyof T][] | undefined;
} | {
    type: "CONJUNCTION";
    andor: "AND" | "OR";
} | {
    type: "LITERAL";
    statement: string;
} | {
    type: "GROUP";
    conditions: NormalizedCondition<T>[];
};
export declare type TSet<T> = {
    [FIELD in keyof T]?: T[FIELD];
};
