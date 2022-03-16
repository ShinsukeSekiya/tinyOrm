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
ava_1.default.serial("実際にDBにアクセス: INSERT（1件）", async (t) => {
    const [sql0, rep0] = tinyOrmCore.insert({
        into: "XXXUsers",
        values: {
            firstName: "苗字",
            secondName: "名前",
            age: 99,
            ext: "CSV",
            height: null,
            weight: 100,
            hasPet: true,
            birthDay: new Date("2022-01-01"),
        },
    });
    await db.query(sql0, rep0);
    const res = await db.query(`SELECT * FROM XXXUsers`);
    t.is(res.length, 1);
    t.is(res[0].age, 99);
    t.is(res[0].firstName, "苗字");
    t.is(res[0].secondName, "名前");
    t.is(res[0].ext, "CSV");
    t.is(res[0].height, null);
    t.is(res[0].weight, 100);
    t.is(res[0].hasPet, true);
    t.is(res[0].birthDay.toISOString(), "2022-01-01T00:00:00.000Z");
});
//
ava_1.default.serial("実際にDBにアクセス: INSERT（1万件）", async (t) => {
    const SIZE = 10000;
    const items = [];
    for (let i = 1; i <= SIZE; i++) {
        items.push({
            firstName: `苗字${i}`,
            secondName: `名前${i}`,
            age: i,
            gender: "MALE",
            ext: null,
            height: null,
            weight: null,
            hasPet: true,
            birthDay: new Date("2022-01-01"),
        });
    }
    // バルクインサート
    const [sql0, rep0] = tinyOrmCore.insert({
        into: "XXXUsers",
        values: items,
    });
    await db.query(sql0, rep0);
    const res = await db.query(`SELECT * FROM XXXUsers`);
    t.is(res[0].age, 1);
    t.is(res[4999].age, 5000);
    t.is(res[9999].age, 10000);
});
