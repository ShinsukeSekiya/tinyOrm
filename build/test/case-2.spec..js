"use strict";
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const helper_1 = require("../helper");
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
ava_1.default.serial("条件の演算子が正しくノーマライズされるか。", (t) => {
    const x = (0, helper_1.normalizeConditions)({
        hoge: {
            "=": 100, "<>": 100, "<=>": 100, "<": 100, "<=": 100, ">": 100, ">=": 100,
            "IS": null, "IS_NOT": null, "LIKE": "%xxx%", "NOT_LIKE": "%xxx%",
            "IN": [98, 99, 100], "NOT_IN": [198, 199, 200], "BETWEEN": [1, 2], "NOT_BETWEEN": [3, 4],
        }
    });
    t.deepEqual(x[0], { type: "VALUE$OPERATOR$FIELD", field: "hoge", operator: "=", value: 100 });
    t.deepEqual(x[0], { type: "VALUE$OPERATOR$FIELD", field: "hoge", operator: "<>", value: 100 });
    t.deepEqual(x[0], { type: "VALUE$OPERATOR$FIELD", field: "hoge", operator: "<=>", value: 100 });
    t.deepEqual(x[0], { type: "VALUE$OPERATOR$FIELD", field: "hoge", operator: "<", value: 100 });
    t.deepEqual(x[0], { type: "VALUE$OPERATOR$FIELD", field: "hoge", operator: "<=", value: 100 });
    t.deepEqual(x[0], { type: "VALUE$OPERATOR$FIELD", field: "hoge", operator: ">", value: 100 });
    t.deepEqual(x[0], { type: "VALUE$OPERATOR$FIELD", field: "hoge", operator: ">=", value: 100 });
    t.deepEqual(x[0], { type: "VALUE$OPERATOR$FIELD", field: "hoge", operator: "IS", value: 100 });
    t.deepEqual(x[0], { type: "VALUE$OPERATOR$FIELD", field: "hoge", operator: "IS_NOT", value: 100 });
    t.deepEqual(x[0], { type: "VALUE$OPERATOR$FIELD", field: "hoge", operator: "LIKE", value: "%xxx%" });
    t.deepEqual(x[0], { type: "VALUE$OPERATOR$FIELD", field: "hoge", operator: "NOT_LIKE", value: "%xxx%" });
    t.deepEqual(x[0], { type: "VALUE$OPERATOR$FIELD", field: "hoge", operator: "IN", value: [98, 99, 100] });
    t.deepEqual(x[0], { type: "VALUE$OPERATOR$FIELD", field: "hoge", operator: "NOT_IN", value: [198, 199, 200] });
    t.deepEqual(x[0], { type: "VALUE$OPERATOR$FIELD", field: "hoge", operator: "BETWEEN", value: [1, 2] });
    t.deepEqual(x[0], { type: "VALUE$OPERATOR$FIELD", field: "hoge", operator: "NOT_BETWEEN", value: [3, 4] });
    t.is(1, 1);
});
