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
const tinyOrmCore = __importStar(require("../.."));
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
ava_1.default.serial("実際にDBにアクセス: REMOVE", async (t) => {
    const SIZE = 3;
    const values = [];
    values.push(`("苗字1", "名前1", 0, "MALE", NULL, NULL, NULL, false, "2022-01-01")`);
    values.push(`("苗字2", "名前2", 10, "MALE", NULL, NULL, NULL, false, "2022-01-01")`);
    values.push(`("苗字3", "名前3", 20, "MALE", NULL, NULL, NULL, false, "2022-01-01")`);
    // バルクインサート
    await db.query(`INSERT INTO XXXUsers (firstName, secondName, age, gender, ext, height, weight, hasPet, birthDay) VALUES ${values.join(", ")}`);
    const [sql, replacements] = tinyOrmCore.remove({
        from: "XXXUsers",
        where: { id: { "=": 1 } },
    });
    await db.query(sql, Object.assign({}, replacements), false);
    const res = await db.query(`SELECT * FROM XXXUsers`);
    t.is(res.length, 2);
    t.is(res[0].id, 2);
    t.is(res[1].id, 3);
});
