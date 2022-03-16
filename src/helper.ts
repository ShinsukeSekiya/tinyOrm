import * as types from "./types";
import {OP} from "./index";

//
// HELPER - - - - - - - - - - - - - - 
//

//
// 型がつく　Object.keys()
//
export const typedKeys = <T extends {}>(o: T): Array<keyof T> => <Array<keyof T>>Object.keys(o);

//
// Objectかどうか。
//
export const isObject = (x: any): x is object =>{
    return !Array.isArray(x) && typeof x == "object" && x !== null;
};

//
// REPLACEMENT 
// placeholderとして、リスト(配列)とユニークなマップを作成。
//
export class Replacer {
    idx: number;
    map: types.ReplacementMap;
    constructor( initialValue?: types.ReplacementMap ){
        this.idx = 0;
        this.map = initialValue ? initialValue : {};
    }
    field(value: any){
        const key = `_${++this.idx}_`;
        this.map[key] = value;
        return `@${key}`
    }
    value(value: any){
        const key = `_${++this.idx}_`;
        this.map[key] = value;
        return `:${key}`
    }
}

//
// 条件文 {field: {"=": value}} の形式化どうか。
//
export const isValue$Operator$Field = <T>( x: any ): x is types.Value$Operator$Field<T> =>{
    if (!isObject(x)) return false;
    return typedKeys(x).every((field)=>
        isObject(x[field]) && 
        Object.keys(x[field]).every((operator)=>
            (Object.values(OP) as string[]).includes(operator) // 2階層目のKEYが "=" などの演算子かどうか確認。
        )
    );
};

//
// NORMALIZE - - - - - - - - - - - - - - 
//

//
//
//
export const normalizeFields = <T>( fields: types.Field<T>[] ) => {
    const result: types.NormalizedField<T>[] = [];
    for (let field of fields){
        if (field == "*"){
            result.push({type: "ASTARISK"});
        } else if (typeof field === "string"){
            result.push({type: "NORMAL", field });
        } else if (isObject(field)){
            const [alies, statement] = Object.entries(field)[0];
            result.push({type: "LITERAL", alies, statement});
        } else {
            throw new Error(`エラーがあります`);
        }
    }
    return result;
};

//
//
//
export const normalizeConditions = <T>( conds: types.TheCondition<T> ): types.NormalizedCondition<T>[] =>{
    
    let result: types.NormalizedCondition<T>[] = [];
    if (isValue$Operator$Field<T>(conds)){ 
        // オブジェクトの場合。（{f:{op:v}, f:{op:v, op:v}} など）
        for(let f of typedKeys(conds)){
            const v$op = conds[f] || null; // v$opの例=> {f:{op:v, op:v}}
            const operators = typedKeys<types.Value$Operator<T, typeof f>>(v$op||{});
            for(let op of operators ){
                const v = v$op ? v$op[op] : undefined;
                result.push({
                    type: "VALUE$OPERATOR$FIELD",
                    field: f,
                    operator: op,
                    value: v,
                });
            }
        }
        return result;
    } else if (conds === "AND" || conds === "OR") {
        // AND か OR
        return [{
            type: "CONJUNCTION",
            andor: conds,
        }];
    } else if (typeof conds == "string") {
        // LITERAL
        return [{
            type: "LITERAL",
            statement: conds,
        }];
    } else if (Array.isArray(conds)) {
        // 配列の場合
        let array: types.NormalizedCondition<T>[] = [];
        for(let cond of conds){
            const xxx = normalizeConditions(cond);
            array = array.concat(xxx); // フラットに扱う
        }
        result.push({
            type: "GROUP",
            conditions: array,
        });
        return result;
    } else {
        throw new Error(`エラーがあります`);
    }
};

//
// RENDER - - - - - - - - - - - 
//

//
//
//
export const renderCondition = <T>(nconditions: types.NormalizedCondition<T>[], replacer: Replacer )=>{
    const sql: string[] = [];
    for(let i=0; i<nconditions.length; i++){
        const ncond = nconditions[i];
        if (ncond.type === "GROUP"){
            // グループ（＝括弧）
            sql.push(`( ${renderCondition(ncond.conditions, replacer)} )`);
        } else if (ncond.type === "LITERAL") {
            sql.push(ncond.statement);
        } else if (ncond.type === "CONJUNCTION") {
            //ここでANDかORが有るのは構文エラー。
            sql.push(ncond.andor); 
            console.error(`構文エラー '${ncond.andor}'`);
        } else if (ncond.type === "VALUE$OPERATOR$FIELD") {
            // 条件のオブジェクト　{field: {"=": "100"}}
            if ( ncond.operator === "IN" || ncond.operator === "NOT_IN" ){
                // IN
                if (!Array.isArray(ncond.value)){
                    throw new Error("invalid.");
                }
                sql.push(`${replacer.field(ncond.field)} ${ncond.operator.replace("_"," ")} (${replacer.value(ncond.value)})`);
            } else if ( ncond.operator === "BETWEEN" || ncond.operator === "NOT_BETWEEN" ){
                // BETWEEN
                if (!Array.isArray(ncond.value) || ncond.value.length !== 2){
                    throw new Error("invalid.");
                }
                sql.push(`${replacer.field(ncond.field)} ${ncond.operator.replace("_"," ")} ${replacer.value(ncond.value[0])} AND ${replacer.value(ncond.value[1])}`);
            } else {
                // それ以外
                sql.push(`${replacer.field(ncond.field)} ${ncond.operator.replace("_"," ")} ${replacer.value(ncond.value)}`);
            }   
        }
        // 1つ次がANDかORが指定されてればそれを。なければAND。
        const next = nconditions[i+1];
        if (next){
            if (next.type === "CONJUNCTION"){
                sql.push(next.andor);
                i++;
            } else {
                sql.push("AND");
            }
        }
    }
    return sql.join(" ");
};

//
//  CaseWhen 型のガード
//
const isCaseWhen = <T>( x: any ): x is types.CaseWhen<T, keyof T> =>{
    return isObject(x) && x.hasOwnProperty("when") && ( x.hasOwnProperty("then") || x.hasOwnProperty("thenLiteral") );
}
const isCaseElse = <T>( x: any ): x is types.CaseElse<T, keyof T> =>{
    return isObject(x) && ( x.hasOwnProperty("else") || x.hasOwnProperty("elseField") );
}

//
//
//
export const renderSet = <T>( set: types.TSet<T>, replacer: Replacer)=>{
    const x: string[] = [];
    for (let field of typedKeys(set)){
        const value = set[field];
        if (Array.isArray(value)){
            // field = CASE WHEN 〜　ELSE 〜 END
            x.push(`${replacer.field(field)} = ${renderCase(value, replacer)}`);
        } else {
            // field = value, field = value
            x.push(`${replacer.field(field)} = ${replacer.value(value)}`);
        }
    }
    return x.join(", ");
};

//
//
//
export const renderCase = <T>( caseItems: any[], replacer: Replacer)=>{
    const x: string[] = [];
    x.push(`CASE`);
    for (let item of caseItems){
        if (isCaseWhen<T>(item)){
            x.push(`WHEN ${renderCondition<T>(normalizeConditions(item.when), replacer)} THEN ${item.thenLiteral ? item.thenLiteral : replacer.value(item.then)}`);
        } else if (isCaseElse<T>(item)){
            x.push(`ELSE ${item.elseField ? replacer.field(item.elseField) : replacer.value(item.else)}`);
        } else if (typeof item === "string"){
            x.push(item);
        } else {
            throw new Error("invalid");
        }
    }
    x.push(`END`);
    return x.join("\n");
};