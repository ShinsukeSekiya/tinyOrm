// TYPES
import * as types from "./types";
export * from "./types";
// HELPER
import * as helper from "./helper";

// 条件文の演算子（実際にSQLにするときは「_」は削除する）
export const OP = {
    EQ: "=",
    NOTEQ1: "<>",
    NOTEQ2: "<=>",
    LT: "<",
    LTE: "<=",
    GT: ">",
    GTE: ">=",
    IS: "IS",
    ISNOT: "IS_NOT",
    LIKE: "LIKE",
    NOTLIKE: "NOT_LIKE",
    IN: "IN",
    NOTIN: "NOT_IN",
    BETWEEN: "BETWEEN",
    NOTBETWEEN: "NOT_BETWEEN",
} as const;



// MAIN - - - - - - - - - - - - - - - - - - - - - - - - -

//
//
//
export const find = <T>(params: types.FindParams<T>)=>{
    const replacer = new helper.Replacer();
    // クエリ文字列を組み立てる
    let sql: string[] = [];
    // SELECT
    if (typeof params.select == "string"){
        sql.push(`SELECT ${params.select}`);
    } else {
        const _f: string [] = [];
        for(let item of helper.normalizeFields(params.select)){
            if (item.type === "ASTARISK"){
                _f.push("*")
            } else if (item.type === "NORMAL"){
                _f.push(`${replacer.field(item.field)}`);
            } else if (item.type === "LITERAL"){
                _f.push(`${item.statement} AS ${replacer.field(item.alies)}`);
            }
        }
        sql.push(`SELECT ${_f.join(", ")}`);
    }
    // FROM
    sql.push(`FROM ${params.from}`);
    // WHERE
    if (typeof params.where === "string"){
        sql.push(`WHERE ${params.where}`);
    } else if (params.where !== undefined){
        const x = helper.renderCondition<T>( helper.normalizeConditions<T>(params.where), replacer );
        sql.push(`WHERE ${x}`);
    }
    // ORDER BY
    if ( params.orderBy !== undefined ){
        const x: string[] = [];
        for(let field of helper.typedKeys(params.orderBy)){
            const item = params.orderBy[field];
            item && x.push(`${replacer.field(field)} ${item}`);
        }
        sql.push(`ORDER BY ${x.join(", ")}`);
    }
    // LIMIT
    if (params.limit !== undefined){
        sql.push(`LIMIT ${replacer.value(params.limit)}`); 
    }
    // OFFSET
    if (params.offset !== undefined){
        sql.push(`OFFSET ${replacer.value(params.limit)}`);
    }
    // GROUP BY
    if (params.grouBy !== undefined){
        const x = params.grouBy.map((item)=>`${replacer.field(item)}`)
        sql.push(`ORDER BY ${x.join(", ")}`);
    }
    //
    return [sql.join("\n"), replacer.map];
};

//
//
//
export const update = <T>( paramsList: types.UpdateParams<T>|types.UpdateParams<T>[] )=>{
    const replacer = new helper.Replacer();
    // クエリ文字列を組み立てる
    let sql: string[] = [];
    paramsList = Array.isArray(paramsList) ? paramsList : [paramsList];
    for(let params of paramsList ){
        sql.push(`UPDATE ${params.table}`);
        sql.push(`SET ${helper.renderSet(params.set, replacer)}`);
        if (typeof params.where === "string"){
            sql.push(`WHERE ${params.where}`);
        } else if (params.where !== undefined){
            const x = helper.renderCondition<T>( helper.normalizeConditions<T>(params.where), replacer );
            sql.push(`WHERE ${x}`);
        }
        // 
        sql.push(";");
    }
    //
    return [sql.join("\n"), replacer.map];
};

//
//
//
export const insert = <T>( paramsList: types.InsertParams<T>|types.InsertParams<T>[] )=>{
    const replacer = new helper.Replacer();
    // クエリ文字列を組み立てる
    let sql: string[] = [];
    paramsList = Array.isArray(paramsList) ? paramsList : [paramsList];
    for(let params of paramsList ){
        sql.push(`INSERT INTO ${params.into}`);
        sql.push(`SET ${helper.renderSet(params.set, replacer)}`);
        // 
        sql.push(";");
    }
    //
    return [sql.join("\n"), replacer.map];
};

//
//
//
export const remove = <T>( params: types.DeleteParams<T> )=>{
    const replacer = new helper.Replacer();
    // クエリ文字列を組み立てる
    let sql: string[] = [];
    
    sql.push(`DELETE FROM ${params.from}`);
    if (typeof params.where === "string"){
        sql.push(`WHERE ${params.where}`);
    } else if (params.where !== undefined){
        const x = helper.renderCondition<T>( helper.normalizeConditions<T>(params.where), replacer );
        sql.push(`WHERE ${x}`);
    }
    // 
    sql.push(";");

    //
    return [sql.join("\n"), replacer.map];
};