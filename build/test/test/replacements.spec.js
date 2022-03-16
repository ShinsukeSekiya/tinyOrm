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
ava_1.default.serial("実際にDBにアクセス: REPLACEMENTS をユーザーが指定する", async (t) => {
    const items = [
        { id: "1", firstName: "苗字1", secondName: "A", age: 0, gender: "MALE", hasPet: true, birthDay: new Date("2022-01-01") },
        { id: "2", firstName: "苗字2", secondName: "B", age: 0, gender: "MALE", hasPet: true, birthDay: new Date("2022-01-01") },
        { id: "3", firstName: "苗字3", secondName: "C", age: 0, gender: "MALE", hasPet: true, birthDay: new Date("2022-01-01") },
        { id: "4", firstName: "苗字4", secondName: "D", age: 0, gender: "MALE", hasPet: null, birthDay: new Date("2022-01-01") },
        { id: "5", firstName: "苗字5", secondName: "E", age: 0, gender: null, hasPet: true, birthDay: new Date("2022-01-01") }, // 対象外
    ];
    for (let item of items) {
        await db.query(`INSERT INTO XXXUsers SET :set;`, { set: item });
    }
    const [sql, replacements] = tinyOrmCore.select({
        fields: ["id", { fullName: "CONCAT(@aaa, @bbb)" }, { hoge: ":hoge" }],
        from: "XXXUsers",
        where: [
            { hasPet: { IS_NOT: null } },
            "AND",
            "@ddd IS NOT :ccc"
        ]
    });
    const res = await db.query(sql, Object.assign(Object.assign({}, replacements), { hoge: "固定値ほげ", aaa: "firstName", bbb: "secondName", ccc: null, ddd: "gender" }), false);
    t.is(res.length, 3);
    t.is(res[0].id, 1);
    t.is(res[0].fullName, "苗字1A");
    t.is(res[0].hoge, "固定値ほげ");
    t.is(res[1].id, 2);
    t.is(res[1].fullName, "苗字2B");
    t.is(res[1].hoge, "固定値ほげ");
    t.is(res[2].id, 3);
    t.is(res[2].fullName, "苗字3C");
    t.is(res[2].hoge, "固定値ほげ");
});
