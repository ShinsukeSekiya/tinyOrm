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
const tinyOrmCore = __importStar(require("../"));
const db = __importStar(require("./db"));
ava_1.default.before(async () => {
    await db.dropTables();
    await db.createTales();
});
ava_1.default.beforeEach(async () => {
    // nop
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
ava_1.default.serial.skip("custom Replacements", async (t) => {
    const [sql, replacements] = tinyOrmCore.select({
        fields: [{ A: ":aaa" }, { B: "@bbb" }],
        from: "XXXUsers"
    }, {
        aaa: "999",
        bbb: "name"
    });
    const res = await db.connection.query(sql, replacements);
    t.is(1, 1);
});
