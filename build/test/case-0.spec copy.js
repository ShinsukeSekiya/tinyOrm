"use strict";
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const finder_1 = require("../finder");
ava_1.default.before(async () => {
    // nop
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
ava_1.default.serial("オブジェクト", async (t) => {
    const x = (0, finder_1.normalizeConditions)({
        name: { "=": "a", IS: "b" },
        age: { ">": 0, "<": 10 },
        married: { "=": true },
        ext: { IN: ["CSV", "JSON"], NOT_IN: ["TSV", "XML"] },
    });
    t.deepEqual(x[0], { type: "VALUE$OPERATOR$FIELD", field: "name", operator: "=", value: "a", });
    t.deepEqual(x[1], { type: "VALUE$OPERATOR$FIELD", field: "name", operator: "IS", value: "b", });
    t.deepEqual(x[2], { type: "VALUE$OPERATOR$FIELD", field: "age", operator: ">", value: 0, });
    t.deepEqual(x[3], { type: "VALUE$OPERATOR$FIELD", field: "age", operator: "<", value: 10, });
    t.deepEqual(x[4], { type: "VALUE$OPERATOR$FIELD", field: "married", operator: "=", value: true, });
    t.deepEqual(x[5], { type: "VALUE$OPERATOR$FIELD", field: "ext", operator: "IN", value: ["CSV", "JSON"], });
    t.deepEqual(x[6], { type: "VALUE$OPERATOR$FIELD", field: "ext", operator: "NOT_IN", value: ["TSV", "XML"], });
});
//
//
//
ava_1.default.serial("配列内の多層構造オブジェクト", async (t) => {
    const x = (0, finder_1.normalizeConditions)([
        {
            name: { "=": "a", IS: "b" },
            age: { ">": 0, "<": 10 },
        },
        "AND",
        { married: { "=": true }, },
        "OR",
        { ext: { IN: ["CSV", "JSON"], NOT_IN: ["TSV", "XML"] }, },
        [
            { height: { ">": 0, "<": 10 }, },
            "OR",
            [
                { weight: { ">": 0, "<": 10 }, }
            ]
        ]
    ]);
    t.is(x[0].type, "GROUP");
    const x0 = x[0].conditions;
    t.deepEqual(x0[0], { type: "VALUE$OPERATOR$FIELD", field: "name", operator: "=", value: "a", });
    t.deepEqual(x0[1], { type: "VALUE$OPERATOR$FIELD", field: "name", operator: "IS", value: "b", });
    t.deepEqual(x0[2], { type: "VALUE$OPERATOR$FIELD", field: "age", operator: ">", value: 0, });
    t.deepEqual(x0[3], { type: "VALUE$OPERATOR$FIELD", field: "age", operator: "<", value: 10, });
    t.deepEqual(x0[4], { type: "CONJUNCTION", andor: "AND", });
    t.deepEqual(x0[5], { type: "VALUE$OPERATOR$FIELD", field: "married", operator: "=", value: true, });
    t.deepEqual(x0[6], { type: "CONJUNCTION", andor: "OR", });
    t.deepEqual(x0[7], { type: "VALUE$OPERATOR$FIELD", field: "ext", operator: "IN", value: ["CSV", "JSON"], });
    t.deepEqual(x0[8], { type: "VALUE$OPERATOR$FIELD", field: "ext", operator: "NOT_IN", value: ["TSV", "XML"], });
    t.is(x0[9].type, "GROUP");
    const x09 = x0[9].conditions;
    t.deepEqual(x09[0], { type: "VALUE$OPERATOR$FIELD", field: "height", operator: ">", value: 0, });
    t.deepEqual(x09[1], { type: "VALUE$OPERATOR$FIELD", field: "height", operator: "<", value: 10, });
    t.deepEqual(x09[2], { type: "CONJUNCTION", andor: "OR", });
    t.is(x09[3].type, "GROUP");
    const x093 = x09[3];
    t.deepEqual(x093[0], { type: "VALUE$OPERATOR$FIELD", field: "weight", operator: ">", value: 0, });
    t.deepEqual(x093[1], { type: "VALUE$OPERATOR$FIELD", field: "weight", operator: "<", value: 10, });
});
