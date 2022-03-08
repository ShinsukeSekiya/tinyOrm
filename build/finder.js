"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updater = exports.finder = exports.normalizeConditions = exports.normalizeFields = exports.isValue$Operator$Field = exports.typedKeys = exports.OP = void 0;
// 条件文の演算子（実際にSQLにするときは「_」は削除する）
exports.OP = {
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
};
// HELPER - - - - - - - - - - - - - - 
//
// 型がつく　Object.keys()
//
const typedKeys = (o) => Object.keys(o);
exports.typedKeys = typedKeys;
//
// Objectかどうか。
//
const isObject = (x) => {
    return !Array.isArray(x) && typeof x == "object" && x !== null;
};
//
// REPLACEMENT のユニークなキートマップを作成 
//
class Replacer {
    constructor() {
        this.idx = 0;
        this.map = {};
    }
    field(value) {
        const key = `_${++this.idx}_`;
        this.map[key] = value;
        return `@${key}`;
    }
    value(value) {
        const key = `_${++this.idx}_`;
        this.map[key] = value;
        return `:${key}`;
    }
}
//
// 条件文 {field: {"=": value}} の形式化どうか。
//
const isValue$Operator$Field = (x) => {
    if (!isObject(x))
        return false;
    return (0, exports.typedKeys)(x).every((field) => isObject(x[field]) &&
        Object.keys(x[field]).every((operator) => Object.values(exports.OP).includes(operator) // 2階層目のKEYが "=" などの演算子かどうか確認。
        ));
};
exports.isValue$Operator$Field = isValue$Operator$Field;
// NORMALIZE - - - - - - - - - - - - - - 
//
//
//
const normalizeFields = (fields) => {
    const result = [];
    for (let field of fields) {
        if (field == "*") {
            result.push({ type: "ASTARISK" });
        }
        else if (typeof field === "string") {
            result.push({ type: "NORMAL", field });
        }
        else if (isObject(field)) {
            const [alies, statement] = Object.entries(field)[0];
            result.push({ type: "LITERAL", alies, statement });
        }
        else {
            throw new Error(`エラーがあります`);
        }
    }
    return result;
};
exports.normalizeFields = normalizeFields;
//
//
//
const normalizeConditions = (conds) => {
    let result = [];
    if ((0, exports.isValue$Operator$Field)(conds)) {
        // オブジェクトの場合。（{f:{op:v}, f:{op:v, op:v}} など）
        for (let f of (0, exports.typedKeys)(conds)) {
            const v$op = conds[f] || null; // v$opの例=> {f:{op:v, op:v}}
            const operators = (0, exports.typedKeys)(v$op || {});
            for (let op of operators) {
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
    }
    else if (conds === "AND" || conds === "OR") {
        // AND か OR
        return [{
                type: "CONJUNCTION",
                andor: conds,
            }];
    }
    else if (typeof conds == "string") {
        // LITERAL
        return [{
                type: "LITERAL",
                statement: conds,
            }];
    }
    else if (Array.isArray(conds)) {
        // 配列の場合
        let array = [];
        for (let cond of conds) {
            const xxx = (0, exports.normalizeConditions)(cond);
            array = array.concat(xxx); // フラットに扱う
        }
        result.push({
            type: "GROUP",
            conditions: array,
        });
        return result;
    }
    else {
        throw new Error(`エラーがあります`);
    }
};
exports.normalizeConditions = normalizeConditions;
//
//
//
const finder = (params) => {
    const replacer = new Replacer();
    // クエリ文字列を組み立てる
    let sql = [];
    // SELECT
    if (typeof params.select == "string") {
        sql.push(`SELECT ${params.select}`);
    }
    else {
        const _f = [];
        for (let item of (0, exports.normalizeFields)(params.select)) {
            if (item.type === "ASTARISK") {
                _f.push("*");
            }
            else if (item.type === "NORMAL") {
                _f.push(`${replacer.field(item.field)}`);
            }
            else if (item.type === "LITERAL") {
                _f.push(`${item.statement} AS ${replacer.field(item.alies)}`);
            }
        }
        sql.push(`SELECT ${_f.join(", ")}`);
    }
    // FROM
    sql.push(`FROM ${params.from}`);
    // WHERE
    if (typeof params.where === "string") {
        sql.push(`WHERE ${params.where}`);
    }
    else if (params.where !== undefined) {
        const x = renderCondition((0, exports.normalizeConditions)(params.where), replacer);
        sql.push(`WHERE ${x}`);
    }
    // ORDER BY
    if (params.orderBy !== undefined) {
        const x = [];
        for (let field of (0, exports.typedKeys)(params.orderBy)) {
            const item = params.orderBy[field];
            item && x.push(`${replacer.field(field)} ${item}`);
        }
        sql.push(`ORDER BY ${x.join(", ")}`);
    }
    // LIMIT
    if (params.limit !== undefined) {
        sql.push(`LIMIT ${replacer.value(params.limit)}`);
    }
    // OFFSET
    if (params.offset !== undefined) {
        sql.push(`OFFSET ${replacer.value(params.limit)}`);
    }
    // GROUP BY
    if (params.grouBy !== undefined) {
        const x = params.grouBy.map((item) => `${replacer.field(item)}`);
        sql.push(`ORDER BY ${x.join(", ")}`);
    }
    //
    return [sql.join("\n"), replacer.map];
};
exports.finder = finder;
//
//
//
const updater = (paramsList) => {
    const replacer = new Replacer();
    // クエリ文字列を組み立てる
    let sql = [];
    paramsList = Array.isArray(paramsList) ? paramsList : [paramsList];
    for (let params of paramsList) {
        sql.push(`UPDATE ${params.table}`);
        const x = [];
        for (let field of (0, exports.typedKeys)(params.set)) {
            x.push(`${replacer.field(field)} = ${replacer.value(params.set[field])}`);
        }
        sql.push(`SET ${x.join(", ")}`);
        if (typeof params.where === "string") {
            sql.push(`WHERE ${params.where}`);
        }
        else if (params.where !== undefined) {
            const x = renderCondition((0, exports.normalizeConditions)(params.where), replacer);
            sql.push(`WHERE ${x}`);
        }
        // ss
        sql.push(";");
    }
    //
    return [sql.join("\n"), replacer.map];
};
exports.updater = updater;
// RENDER - - - - - - - - - - - 
//
//
//
const renderCondition = (_cs, replacer) => {
    const sql = [];
    for (let i = 0; i < _cs.length; i++) {
        const _c = _cs[i];
        if (_c.type === "GROUP") {
            // グループ（＝括弧）
            sql.push(`( ${renderCondition(_c.conditions, replacer)} )`);
        }
        else if (_c.type === "LITERAL") {
            sql.push(_c.statement);
        }
        else if (_c.type === "CONJUNCTION") {
            //ここでANDかORが有るのは構文エラー。
            sql.push(_c.andor);
            console.error(`構文エラー '${_c.andor}'`);
        }
        else if (_c.type === "VALUE$OPERATOR$FIELD") {
            // 条件のオブジェクト　{field: {"=": "100"}}
            if (_c.operator === "IN" || _c.operator === "NOT_IN") {
                // IN
                if (!Array.isArray(_c.value)) {
                    throw new Error("invalid.");
                }
                sql.push(`${replacer.field(_c.field)} ${_c.operator.replace("_", " ")} (${replacer.value(_c.value)})`);
            }
            else if (_c.operator === "BETWEEN" || _c.operator === "NOT_BETWEEN") {
                // BETWEEN
                if (!Array.isArray(_c.value) || _c.value.length !== 2) {
                    throw new Error("invalid.");
                }
                sql.push(`${replacer.field(_c.field)} ${_c.operator.replace("_", " ")} ${replacer.value(_c.value[0])} AND ${replacer.value(_c.value[1])}`);
            }
            else {
                // それ以外
                sql.push(`${replacer.field(_c.field)} ${_c.operator.replace("_", " ")} ${replacer.value(_c.value)}`);
            }
        }
        // 1つ次がANDかORが指定されてればそれを。なければAND。
        const next = _cs[i + 1];
        if (next) {
            if (next.type === "CONJUNCTION") {
                sql.push(next.andor);
                i++;
            }
            else {
                sql.push("AND");
            }
        }
    }
    return sql.join(" ");
};
