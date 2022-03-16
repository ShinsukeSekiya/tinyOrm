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
        { id: "1", firstName: "苗字1", secondName: "A", age: 0, gender: "MALE", ext: null, height: 50, weight: 50, hasPet: true, birthDay: new Date("2022-01-01") },
        { id: "2", firstName: "苗字2", secondName: "B", age: 0, gender: "MALE", ext: null, height: 50, weight: 50, hasPet: true, birthDay: new Date("2022-01-01") },
        { id: "3", firstName: "苗字3", secondName: "C", age: 0, gender: "MALE", ext: null, height: 50, weight: 50, hasPet: true, birthDay: new Date("2022-01-01") },
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
ava_1.default.serial("実際にDBにアクセス: UPDATE、個別に実施", async (t) => {
    // id = 1
    const [sql1, replacements1] = tinyOrmCore.update({ table: "XXXUsers", set: { age: 100, ext: "CSV" }, where: { id: { "=": 1 } } });
    await db.query(sql1, Object.assign({}, replacements1), false);
    // id = 2
    const [sql2, replacements2] = tinyOrmCore.update({ table: "XXXUsers", set: { age: 200, ext: "XML" }, where: { id: { "=": 2 } } });
    await db.query(sql2, Object.assign({}, replacements2), false);
    const res = await db.query(`SELECT * FROM XXXUsers`);
    test10(t, res);
});
const test10 = (t, res) => {
    t.is(res[0].age, 100);
    t.is(res[0].ext, "CSV");
    t.is(res[1].age, 200);
    t.is(res[1].ext, "XML");
    t.is(res[2].age, 0);
    t.is(res[2].ext, null);
};
ava_1.default.serial("実際にDBにアクセス: UPDATE、個別に実施 を文字列で。", async (t) => {
    // id = 1
    const [sql1, replacements1] = tinyOrmCore.update({ table: "XXXUsers", set: "age = 100, ext = 'CSV'", where: "id = 1" });
    await db.query(sql1, Object.assign({}, replacements1), false);
    // id = 2
    const [sql2, replacements2] = tinyOrmCore.update({ table: "XXXUsers", set: "age = 200, ext = 'XML'", where: "id = 2" });
    await db.query(sql2, Object.assign({}, replacements2), false);
    const res = await db.query(`SELECT * FROM XXXUsers`);
    test10(t, res);
});
//
ava_1.default.serial("実際にDBにアクセス: UPDATE CASEを使って1文で。", async (t) => {
    const [sql, replacements] = tinyOrmCore.update({
        table: "XXXUsers",
        set: {
            age: [
                { when: { id: { "=": 1 } }, then: 100 },
                { when: { id: { "=": 2 } }, then: 200 },
                { elseField: "age" },
            ],
            ext: [
                { when: { id: { "=": 1 } }, then: "CSV" },
                { when: { id: { "=": 2 } }, then: "XML" },
                { elseField: "ext" },
            ],
        },
    });
    await db.query(sql, Object.assign({}, replacements), false);
    const res = await db.query(`SELECT * FROM XXXUsers`);
    test10(t, res);
});
