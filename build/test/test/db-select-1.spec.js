"use strict";
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const tinyOrmCore = __importStar(require("../../"));
const db = __importStar(require("../db"));
ava_1.default.before(async () => {
});
ava_1.default.beforeEach(async () => {
    await db.dropTables();
    await db.createTales();
    const items = [
        { id: "1", firstName: "あ", secondName: "か", age: 10, gender: "MALE", ext: "CSV", height: 50, weight: 10, hasPet: true, birthDay: new Date("2022-01-01") },
        { id: "2", firstName: "い", secondName: "き", age: 20, gender: "MALE", ext: "XML", height: 50, weight: 50, hasPet: true, birthDay: new Date("2022-01-01") },
        { id: "3", firstName: "う", secondName: "く", age: 30, gender: "FEMALE", ext: "CSV", height: 10, weight: 10, hasPet: true, birthDay: new Date("2022-01-01") },
        { id: "4", firstName: "え", secondName: "け", age: 40, gender: "FEMALE", ext: "XML", height: 10, weight: 50, hasPet: true, birthDay: new Date("2022-01-01") },
        { id: "5", firstName: "お", secondName: "こ", age: 50, gender: "FEMALE", ext: "JSON", height: 0, weight: 50, hasPet: false, birthDay: new Date("2022-01-01") },
    ];
    for (let item of items) {
        await db.query(`INSERT INTO XXXUsers SET :set;`, { set: item });
    }
});
ava_1.default.afterEach.always(async () => {
    // nop
});
ava_1.default.after(async () => {
    // nop
});
//
ava_1.default.serial("実際にDBにアクセス: SELECT", async (t) => {
    const [sql, replacements] = tinyOrmCore.select({
        fields: ["id", "age"],
        from: "XXXUsers",
        where: { age: { "<=": 20 } }
    });
    const res = await db.query(sql, replacements, false);
    t.is(res.length, 2);
    t.is(Object.keys(res[0]).length, 2), "idとageだけ";
    t.is(res[0].id, 1);
    t.is(res[0].age, 10);
    t.is(res[1].id, 2);
    t.is(res[1].age, 20);
});
//
ava_1.default.serial("実際にDBにアクセス: SELECT、ORDER BY DESC", async (t) => {
    const [sql, replacements] = tinyOrmCore.select({
        fields: "id, age",
        from: "XXXUsers",
        orderBy: { height: "DESC", weight: "DESC" },
    });
    const res = await db.query(sql, replacements, false);
    test10(t, res);
});
const test10 = (t, res) => {
    t.is(res[0].id, 2);
    t.is(res[1].id, 1);
    t.is(res[2].id, 4);
    t.is(res[3].id, 3);
    t.is(res[4].id, 5);
};
//
ava_1.default.serial("実際にDBにアクセス: SELECT、ORDER BY DESC、を文字列で。", async (t) => {
    const [sql, replacements] = tinyOrmCore.select({
        fields: "id, age",
        from: "XXXUsers",
        orderBy: "height DESC, weight DESC",
    });
    const res = await db.query(sql, replacements, false);
    test10(t, res);
});
//
ava_1.default.serial("実際にDBにアクセス: SELECT GROUP BY と HAVING と SUM(リテラルな列)", async (t) => {
    const [sql, replacements] = tinyOrmCore.select({
        fields: ["ext", { sum: "SUM(age)" }],
        from: "XXXUsers",
        where: { hasPet: { IS: true } },
        grouBy: ["ext"],
        having: { ext: { IN: ["CSV", "XML"] } },
    });
    const res = await db.query(sql, replacements, false);
    test20(t, res);
});
const test20 = (t, res) => {
    t.is(res.length, 2);
    t.is(res[0].ext, "XML");
    t.is(res[0].sum, 60);
    t.is(res[1].ext, "CSV");
    t.is(res[1].sum, 40);
};
//
ava_1.default.serial("実際にDBにアクセス: SELECT GROUP BY と HAVING と SUM(リテラルな列) を文字列で。", async (t) => {
    const [sql, replacements] = tinyOrmCore.select({
        fields: "ext, SUM(age) AS sum",
        from: "XXXUsers",
        where: "hasPet IS true",
        grouBy: "ext",
        having: "ext IN ('CSV','XML')",
    });
    const res = await db.query(sql, replacements, false);
    test20(t, res);
});
//
ava_1.default.serial("実際にDBにアクセス: SELECT LIMIT OFFSET", async (t) => {
    const [sql, replacements] = tinyOrmCore.select({
        fields: ["id"],
        from: "XXXUsers",
        offset: 3,
        limit: 2,
    });
    const res = await db.query(sql, replacements, false);
    t.is(res.length, 2);
    t.is(res[0].id, 3);
    t.is(res[1].id, 4);
});
