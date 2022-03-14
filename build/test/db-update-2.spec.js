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
//import * as tinyOrm from "../api";
const tinyOrmCore = __importStar(require(".."));
const db = __importStar(require("./db"));
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
ava_1.default.serial("実際にDBにアクセス: UPDATE、10万件をCASEを使って個別にUPDATEする", async (t) => {
    const SIZE = 10000;
    const items = [];
    for (let i = 1; i <= SIZE; i++) {
        items.push({ id: null, firstName: `苗字${i}`, secondName: `名前${i}`, age: 0, gender: "MALE", ext: null, height: null, weight: null, hasPet: true });
    }
    const [sql0, rep0] = tinyOrmCore.insert({
        into: "XXXUsers",
        values: items,
    });
    await db.query(sql0, rep0);
    const cases = [];
    for (let i = 1; i <= SIZE; i++) {
        // idごとに heightに値をふる。
        cases.push({ when: { "id": { "=": i } }, then: i });
    }
    const [sql, replacements] = tinyOrmCore.update({
        table: "XXXUsers",
        set: { height: cases }
    });
    await db.query(sql, Object.assign({}, replacements), false);
    const res = await db.query(`SELECT * FROM XXXUsers`);
    t.is(res[0].height, 1);
    t.is(res[4999].height, 5000);
    t.is(res[9999].height, 10000);
});
