// TYPES
import * as types from "./types";
export * from "./types";
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
export const select = <T>(params: types.SelectParams<T>, replacements?: types.ReplacementMap )=>{
    const replacer = new helper.Replacer(replacements);
    // クエリ文字列を組み立てる
    let sql: string[] = [];
    // FIELDS
    if (typeof params.fields == "string"){
        sql.push(`SELECT ${params.fields}`);
    } else {
        const subsql: string [] = [];
        for(let item of helper.normalizeFields(params.fields)){
            if (item.type === "ASTARISK"){
                subsql.push("*")
            } else if (item.type === "NORMAL"){
                subsql.push(`${replacer.field(item.field)}`);
            } else if (item.type === "LITERAL"){
                subsql.push(`${item.statement} AS ${replacer.field(item.alies)}`);
            }
        }
        sql.push(`SELECT ${subsql.join(", ")}`);
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
    if (typeof params.orderBy === "string"){
        sql.push(`ORDER BY ${params.orderBy}`);
    } else if (helper.isObject(params.orderBy)){
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
    if (typeof params.grouBy === "string"){
        sql.push(`GROUP BY ${params.grouBy}`);
    } else if (Array.isArray(params.grouBy)){
        const x = params.grouBy.map((item)=>`${replacer.field(item)}`)
        sql.push(`GROUP BY ${x.join(", ")}`);
    }
    // HAVING
    if (typeof params.having === "string"){
        sql.push(`HAVING ${params.having}`);
    } else if (params.having !== undefined){
        const x = helper.renderCondition<T>( helper.normalizeConditions<T>(params.having), replacer );
        sql.push(`HAVING ${x}`);
    }
    return [
        sql.join("\n") + ";", 
        replacer.map,
    ] as const;
};

//
//
//
export const update = <T>( params: types.UpdateParams<T>, replacements?: types.ReplacementMap  )=>{
    const replacer = new helper.Replacer(replacements);
    // クエリ文字列を組み立てる
    let sql: string[] = [];
    
    sql.push(`UPDATE ${params.table}`);
    if (typeof params.set === "string"){
        sql.push(`SET ${params.set}`);
    } else {
        sql.push(`SET ${helper.renderSet(params.set, replacer)}`);
    }
    if (typeof params.where === "string"){
        sql.push(`WHERE ${params.where}`);
    } else if (params.where !== undefined){
        const x = helper.renderCondition<T>( helper.normalizeConditions<T>(params.where), replacer );
        sql.push(`WHERE ${x}`);
    }

    return [
        sql.join("\n") + ";", 
        replacer.map,
    ] as [string, {[key:string]: any}];
};

//
//
//
export const insert = <T>( params: types.InsertParams<T>, replacements?: types.ReplacementMap  )=>{
    const replacer = new helper.Replacer(replacements);
    // クエリ文字列を組み立てる
    let sql: string[] = [];
    const value$keys = Array.isArray(params.values) ? params.values : [params.values];
    sql.push(`INSERT INTO ${params.into}`);
    // 1つめの.setの内容からカラムを列挙
    sql.push(`(${ Object.keys(value$keys[0]).map((key)=>replacer.field(key)).join(", ") })`);
    const subsql: string[] = [];
    value$keys.forEach( (value$key, idx)=>{
        subsql.push(`/**/ ( ${ Object.values(value$keys).map((value)=>replacer.value(value)).join(", ") } )`);
    });
    sql.push(`VALUES ${subsql.join(", ")}`);
    //
    return [
        sql.join("\n") + ";", 
        replacer.map,
    ] as const;
};

//
//
//
export const remove = <T>( params: types.DeleteParams<T>, replacements?: types.ReplacementMap  )=>{
    const replacer = new helper.Replacer(replacements);
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
    return [
        sql.join("\n") + ";", 
        replacer.map,
    ] as const;
};