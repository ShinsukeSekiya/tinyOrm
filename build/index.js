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
const select = (params, replacements) => {
    const replacer = new helper.Replacer(replacements);
    // クエリ文字列を組み立てる
    let sql = [];
    // FIELDS
    if (typeof params.fields == "string") {
        sql.push(`SELECT ${params.fields}`);
    }
    else {
        const subsql = [];
        for (let item of helper.normalizeFields(params.fields)) {
            if (item.type === "ASTARISK") {
                subsql.push("*");
            }
            else if (item.type === "NORMAL") {
                subsql.push(`${replacer.field(item.field)}`);
            }
            else if (item.type === "LITERAL") {
                subsql.push(`${item.statement} AS ${replacer.field(item.alies)}`);
            }
        }
        sql.push(`SELECT ${subsql.join(", ")}`);
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
    if (typeof params.orderBy === "string") {
        sql.push(`ORDER BY ${params.orderBy}`);
    }
    else if (helper.isObject(params.orderBy)) {
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
    if (typeof params.grouBy === "string") {
        sql.push(`GROUP BY ${params.grouBy}`);
    }
    else if (Array.isArray(params.grouBy)) {
        const x = params.grouBy.map((item) => `${replacer.field(item)}`);
        sql.push(`GROUP BY ${x.join(", ")}`);
    }
    // HAVING
    if (typeof params.having === "string") {
        sql.push(`HAVING ${params.having}`);
    }
    else if (params.having !== undefined) {
        const x = helper.renderCondition(helper.normalizeConditions(params.having), replacer);
        sql.push(`HAVING ${x}`);
    }
    return [
        sql.join("\n") + ";",
        replacer.map
    ];
};
exports.select = select;
//
//
//
const update = (params, replacements) => {
    const replacer = new helper.Replacer(replacements);
    // クエリ文字列を組み立てる
    let sql = [];
    sql.push(`UPDATE ${params.table}`);
    if (typeof params.set === "string") {
        sql.push(`SET ${params.set}`);
    }
    else {
        sql.push(`SET ${helper.renderSet(params.set, replacer)}`);
    }
    if (typeof params.where === "string") {
        sql.push(`WHERE ${params.where}`);
    }
    else if (params.where !== undefined) {
        const x = helper.renderCondition(helper.normalizeConditions(params.where), replacer);
        sql.push(`WHERE ${x}`);
    }
    return [
        sql.join("\n") + ";",
        replacer.map
    ];
};
exports.update = update;
//
//
//
const insert = (params, replacements) => {
    const replacer = new helper.Replacer(replacements);
    // クエリ文字列を組み立てる
    let sql = [];
    const value$keys = Array.isArray(params.values) ? params.values : [params.values];
    sql.push(`INSERT INTO ${params.into}`);
    const colmuns = helper.typedKeys(value$keys[0]);
    // 1つめの.setの内容からカラムを列挙
    sql.push(`(${colmuns.map((key) => replacer.field(key)).join(", ")})`);
    const subsql = [];
    value$keys.forEach((value$key, idx) => {
        subsql.push(`/**/ ( ${colmuns.map((key) => replacer.value(value$key[key])).join(", ")} )`);
    });
    sql.push(`VALUES ${subsql.join(", ")}`);
    //
    return [
        sql.join("\n") + ";",
        replacer.map
    ];
};
exports.insert = insert;
//
//
//
const remove = (params, replacements) => {
    const replacer = new helper.Replacer(replacements);
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
        sql.join("\n") + ";",
        replacer.map
    ];
};
exports.remove = remove;
