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
});
ava_1.default.afterEach.always(async () => {
    // nop
});
ava_1.default.after(async () => {
    // nop
});
//
//
//
ava_1.default.serial("実際にDBにアクセス: SELECT、複雑なWHERE", async (t) => {
    const items = [
        { id: "1", firstName: "はずれ", secondName: "A", age: 0, gender: "MALE", ext: "CSV", height: 50, weight: 50, hasPet: false, birthDay: new Date("2022-01-01") },
        { id: "2", firstName: "あたり", secondName: "B", age: 10, gender: "MALE", ext: "CSV", height: 50, weight: 50, hasPet: false, birthDay: new Date("2022-01-01") },
        { id: "3", firstName: "はずれ", secondName: "C", age: 15, gender: "FEMALE", ext: "CSV", height: 50, weight: 50, hasPet: false, birthDay: new Date("2022-01-01") },
        { id: "4", firstName: "はずれ", secondName: "D", age: 15, gender: "MALE", ext: "XML", height: 50, weight: 50, hasPet: false, birthDay: new Date("2022-01-01") },
        { id: "5", firstName: "あたり", secondName: "E1", age: 14, gender: "MALE", ext: "JSON", height: 50, weight: 50, hasPet: false, birthDay: new Date("2022-01-01") },
        { id: "6", firstName: "あたり", secondName: "E2", age: 15, gender: "MALE", ext: "XML", height: 50, weight: 50, hasPet: true, birthDay: new Date("2022-01-01") },
        { id: "7", firstName: "あたり", secondName: "F1", age: 20, gender: "MALE", ext: "XML", height: 100, weight: 100, hasPet: false, birthDay: new Date("2022-01-01") },
        { id: "8", firstName: "はずれ", secondName: "F2", age: 20, gender: "MALE", ext: "XML", height: 100, weight: 50, hasPet: false, birthDay: new Date("2022-01-01") },
        { id: "9", firstName: "はずれ", secondName: "G", age: 30, gender: "MALE", ext: "CSV", height: 50, weight: 50, hasPet: false, birthDay: new Date("2022-01-01") } // ageが範囲外
    ];
    for (let item of items) {
        await db.query(`INSERT INTO XXXUsers SET :set;`, { set: item });
    }
    //
    const [sql, replacements] = tinyOrmCore.select({
        fields: ["id", "age", { fullName: "CONCAT(@REP1, @REP2)" }],
        from: "XXXUsers",
        where: [
            {
                age: { BETWEEN: [10, 20] },
                gender: { "=": "MALE" },
            },
            [
                { ext: { IN: ["CSV", "JSON"] } },
                "OR",
                [
                    { height: { ">=": 100 } },
                    "weight >= :REP3", // リテラルな条件
                ],
                "OR",
                { hasPet: { IS: true } },
            ]
        ],
        orderBy: { age: "DESC" },
    }, {
        REP1: "firstName",
        REP2: "secondName",
        REP3: 100,
    });
    //
    const res = await db.query(sql, replacements, false);
    //console.log(res);
    t.is(res.length, 4);
    t.is(res[0].id, 7, "ORDER BYで age が最も大きいものが先頭になる");
    t.is(res[0].fullName, "あたりF1");
    t.is(res[1].id, 6);
    t.is(res[1].fullName, "あたりE2");
    t.is(res[2].id, 5);
    t.is(res[2].fullName, "あたりE1");
    t.is(res[3].id, 2);
    t.is(res[3].fullName, "あたりB");
});
