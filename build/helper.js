"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderCase = exports.renderSet = exports.renderCondition = exports.normalizeConditions = exports.normalizeFields = exports.isValue$Operator$Field = exports.Replacer = exports.isObject = exports.typedKeys = void 0;
const index_1 = require("./index");
//
// HELPER - - - - - - - - - - - - - - 
//
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
exports.isObject = isObject;
//
// REPLACEMENT のユニークなキートマップを作成 
//
class Replacer {
    constructor(initialMap) {
        this.idx = 0;
        this.map = initialMap ? initialMap : {};
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
exports.Replacer = Replacer;
//
// 条件文 {field: {"=": value}} の形式化どうか。
//
const isValue$Operator$Field = (x) => {
    if (!(0, exports.isObject)(x))
        return false;
    return (0, exports.typedKeys)(x).every((field) => (0, exports.isObject)(x[field]) &&
        Object.keys(x[field]).every((operator) => Object.values(index_1.OP).includes(operator) // 2階層目のKEYが "=" などの演算子かどうか確認。
        ));
};
exports.isValue$Operator$Field = isValue$Operator$Field;
//
// NORMALIZE - - - - - - - - - - - - - - 
//
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
        else if ((0, exports.isObject)(field)) {
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
// RENDER - - - - - - - - - - - 
//
//
//
//
const renderCondition = (nconditions, replacer) => {
    const sql = [];
    for (let i = 0; i < nconditions.length; i++) {
        const ncond = nconditions[i];
        if (ncond.type === "GROUP") {
            // グループ（＝括弧）
            sql.push(`( ${(0, exports.renderCondition)(ncond.conditions, replacer)} )`);
        }
        else if (ncond.type === "LITERAL") {
            sql.push(ncond.statement);
        }
        else if (ncond.type === "CONJUNCTION") {
            //ここでANDかORが有るのは構文エラー。
            sql.push(ncond.andor);
            console.error(`構文エラー '${ncond.andor}'`);
        }
        else if (ncond.type === "VALUE$OPERATOR$FIELD") {
            // 条件のオブジェクト　{field: {"=": "100"}}
            if (ncond.operator === "IN" || ncond.operator === "NOT_IN") {
                // IN
                if (!Array.isArray(ncond.value)) {
                    throw new Error("invalid.");
                }
                sql.push(`${replacer.field(ncond.field)} ${ncond.operator.replace("_", " ")} (${replacer.value(ncond.value)})`);
            }
            else if (ncond.operator === "BETWEEN" || ncond.operator === "NOT_BETWEEN") {
                // BETWEEN
                if (!Array.isArray(ncond.value) || ncond.value.length !== 2) {
                    throw new Error("invalid.");
                }
                sql.push(`${replacer.field(ncond.field)} ${ncond.operator.replace("_", " ")} ${replacer.value(ncond.value[0])} AND ${replacer.value(ncond.value[1])}`);
            }
            else {
                // それ以外
                sql.push(`${replacer.field(ncond.field)} ${ncond.operator.replace("_", " ")} ${replacer.value(ncond.value)}`);
            }
        }
        // 1つ次がANDかORが指定されてればそれを。なければAND。
        const next = nconditions[i + 1];
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
exports.renderCondition = renderCondition;
//
//  CaseWhen 型のガード
//
const isCaseWhen = (x) => {
    return (0, exports.isObject)(x) && x.hasOwnProperty("when") && (x.hasOwnProperty("then") || x.hasOwnProperty("thenLiteral"));
};
const isCaseElse = (x) => {
    return (0, exports.isObject)(x) && (x.hasOwnProperty("else") || x.hasOwnProperty("elseField"));
};
//
//
//
const renderSet = (set, replacer) => {
    const x = [];
    for (let field of (0, exports.typedKeys)(set)) {
        const value = set[field];
        if (Array.isArray(value)) {
            // field = CASE WHEN 〜　ELSE 〜 END
            x.push(`${replacer.field(field)} = ${(0, exports.renderCase)(value, replacer)}`);
        }
        else {
            // field = value, field = value
            x.push(`${replacer.field(field)} = ${replacer.value(value)}`);
        }
    }
    return x.join(", ");
};
exports.renderSet = renderSet;
//
//
//
const renderCase = (caseItems, replacer) => {
    const x = [];
    x.push(`CASE`);
    for (let item of caseItems) {
        if (isCaseWhen(item)) {
            x.push(`WHEN ${(0, exports.renderCondition)((0, exports.normalizeConditions)(item.when), replacer)} THEN ${item.thenLiteral ? item.thenLiteral : replacer.value(item.then)}`);
        }
        else if (isCaseElse(item)) {
            x.push(`ELSE ${item.elseField ? replacer.field(item.elseField) : replacer.value(item.else)}`);
        }
        else if (typeof item === "string") {
            x.push(item);
        }
        else {
            throw new Error("invalid");
        }
    }
    x.push(`END`);
    return x.join("\n");
};
exports.renderCase = renderCase;
