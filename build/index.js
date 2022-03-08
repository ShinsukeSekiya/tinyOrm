"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.insert = exports.update = exports.select = exports.OP = void 0;
__exportStar(require("./types"), exports);
const helper = __importStar(require("./helper"));
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
// MAIN - - - - - - - - - - - - - - - - - - - - - - - - -
//
//
//
const select = (params) => {
    const replacer = new helper.Replacer();
    // クエリ文字列を組み立てる
    let sql = [];
    // FIELDS
    if (typeof params.fields == "string") {
        sql.push(`SELECT ${params.fields}`);
    }
    else {
        const _f = [];
        for (let item of helper.normalizeFields(params.fields)) {
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
        const x = helper.renderCondition(helper.normalizeConditions(params.where), replacer);
        sql.push(`WHERE ${x}`);
    }
    // ORDER BY
    if (params.orderBy !== undefined) {
        const x = [];
        for (let field of helper.typedKeys(params.orderBy)) {
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
    return [
        sql.join("\n"),
        replacer.map,
    ];
};
exports.select = select;
//
//
//
const update = (paramsList) => {
    const replacer = new helper.Replacer();
    // クエリ文字列を組み立てる
    let sql = [];
    paramsList = Array.isArray(paramsList) ? paramsList : [paramsList];
    for (let params of paramsList) {
        sql.push(`UPDATE ${params.table}`);
        sql.push(`SET ${helper.renderSet(params.set, replacer)}`);
        if (typeof params.where === "string") {
            sql.push(`WHERE ${params.where}`);
        }
        else if (params.where !== undefined) {
            const x = helper.renderCondition(helper.normalizeConditions(params.where), replacer);
            sql.push(`WHERE ${x}`);
        }
        // 
        sql.push(";");
    }
    //
    return [
        sql.join("\n"),
        replacer.map,
    ];
};
exports.update = update;
//
//
//
const insert = (paramsList) => {
    const replacer = new helper.Replacer();
    // クエリ文字列を組み立てる
    let sql = [];
    paramsList = Array.isArray(paramsList) ? paramsList : [paramsList];
    for (let params of paramsList) {
        sql.push(`INSERT INTO ${params.into}`);
        sql.push(`SET ${helper.renderSet(params.set, replacer)}`);
        // 
        sql.push(";");
    }
    //
    return [
        sql.join("\n"),
        replacer.map,
    ];
};
exports.insert = insert;
//
//
//
const remove = (params) => {
    const replacer = new helper.Replacer();
    // クエリ文字列を組み立てる
    let sql = [];
    sql.push(`DELETE FROM ${params.from}`);
    if (typeof params.where === "string") {
        sql.push(`WHERE ${params.where}`);
    }
    else if (params.where !== undefined) {
        const x = helper.renderCondition(helper.normalizeConditions(params.where), replacer);
        sql.push(`WHERE ${x}`);
    }
    // 
    sql.push(";");
    //
    return [
        sql.join("\n"),
        replacer.map,
    ];
};
exports.remove = remove;
