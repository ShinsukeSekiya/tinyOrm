import {OP} from ".";

// 
//
//

// REPLACEMENTS
export type ReplacementMap = {[key:string]: any};
//export type ReplacementList = any[];

// SELECT
export type SelectParams<T> = {
    from: string;
    fields: Field<T>[]|string;
    where?: TheCondition<T>|string;
    offset?: number;
    limit?: number;
    orderBy?: OrderBy<T>|string;
    grouBy?: (keyof T)[]|string;
    having?: TheCondition<T>|string;
}

// UPDATE
export type UpdateParams<T> = {
    table: string;
    set: TSet<T>|string;
    where?: TheCondition<T>|string;
};

// SET
export type TSet<T> = {
    [ FIELD in keyof T]?: T[FIELD] | (Case<T> | string )[]
}

// CASE WHEN 〜 ELSE
export type CaseWhen<T, FIELD extends keyof T = keyof T> = {
    when: TheCondition<T>|string, 
    then?: T[FIELD], 
    thenLiteral?: string;
}
export type CaseElse<T, FIELD extends keyof T = keyof T> = {
    else?: T[FIELD];
    elseField?: FIELD;
}
export type Case<T> = CaseWhen<T> | CaseElse<T>;

// INSERT
export type InsertValues<T> = {[ FIELD in keyof T]?: T[FIELD] };
export type InsertParams<T> = {
    into: string;
    values: InsertValues<T> | InsertValues<T>[];
};

// DELETE 
export type DeleteParams<T> = {
    from: string,
    where: TheCondition<T>|string;
}

//
//
//

// FIELD
export type Field<T> = 
    keyof T 
    | "*"
    | {[as:string]: string}
    ;
// FIELD（正規化後）
export type NormalizedField<T> = 
    { type: "NORMAL", field: keyof T }
    | { type: "ASTARISK" }
    | { type: "LITERAL", alies: string, statement: string }
    ;
// ORDER BY
export type OrderBy<T> = { 
    [ FIELD in keyof T]?: "DESC"|"ASC";
}
// 条件
export type TheCondition<T> =
    Value$Operator$Field<T>
    | "OR"
    | "AND"
    | string // LITERAな条件
    | TheCondition<T>[]
    ;
// 条件文（基本形）{ field: { "=": 999 } }
export type Value$Operator$Field<T> = { 
    [ FIELD in keyof T]?: Value$Operator<T, FIELD>;
};


// 条件文の演算子と値
export type Value$Operator<T, FIELD extends keyof T> = Partial<{ 
    // T[keyof T]だと型判定が正確にならない
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
    [OP.IN]: T[FIELD][]; // ここから複数形
    [OP.NOTIN]: T[FIELD][];
    [OP.BETWEEN]: T[FIELD][];
    [OP.NOTBETWEEN]: T[FIELD][];
}>;

// 条件（正規化後）
export type NormalizedCondition<T> = {
    type: "VALUE$OPERATOR$FIELD";
    field: keyof T;
    operator: typeof OP[keyof typeof OP];
    value: T[keyof T]|T[keyof T][]|undefined;
}|{
    type: "CONJUNCTION";
    andor: "AND"|"OR";
}|{
    type: "LITERAL";
    statement: string;
}|{
    type: "GROUP";
    conditions: NormalizedCondition<T>[];
};

