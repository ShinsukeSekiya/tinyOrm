/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import test, { ExecutionContext } from "ava";
//import * as types from "../types";
import {User} from "./types";
import {
    normalizeConditions,
} from "../helper";

test.before(async () => {
    // nop
});

test.beforeEach(async () => {
    // nop
});

test.afterEach.always(async () => {
    // nop
});

test.after(async () => {
    // nop
});


//
//
//
test.serial("条件の演算子が正しくノーマライズされるか。", (t) => {
    const x = normalizeConditions<User>({
        hoge: {
            "=": 100, "<>": 100, "<=>": 100, "<": 100, "<=": 100, ">": 100, ">=": 100,
            "IS": null, "IS_NOT": null, "LIKE": "%xxx%", "NOT_LIKE": "%xxx%", 
            "IN": [98,99,100], "NOT_IN": [198,199,200], "BETWEEN": [1,2], "NOT_BETWEEN": [3, 4],
        }
    });
    t.deepEqual(x[0], {type: "VALUE$OPERATOR$FIELD", field: "hoge", operator: "=", value: 100});
    t.deepEqual(x[0], {type: "VALUE$OPERATOR$FIELD", field: "hoge", operator: "<>", value: 100});
    t.deepEqual(x[0], {type: "VALUE$OPERATOR$FIELD", field: "hoge", operator: "<=>", value: 100});
    t.deepEqual(x[0], {type: "VALUE$OPERATOR$FIELD", field: "hoge", operator: "<", value: 100});
    t.deepEqual(x[0], {type: "VALUE$OPERATOR$FIELD", field: "hoge", operator: "<=", value: 100});
    t.deepEqual(x[0], {type: "VALUE$OPERATOR$FIELD", field: "hoge", operator: ">", value: 100});
    t.deepEqual(x[0], {type: "VALUE$OPERATOR$FIELD", field: "hoge", operator: ">=", value: 100});
    t.deepEqual(x[0], {type: "VALUE$OPERATOR$FIELD", field: "hoge", operator: "IS", value: 100});
    t.deepEqual(x[0], {type: "VALUE$OPERATOR$FIELD", field: "hoge", operator: "IS_NOT", value: 100});
    t.deepEqual(x[0], {type: "VALUE$OPERATOR$FIELD", field: "hoge", operator: "LIKE", value: "%xxx%"});
    t.deepEqual(x[0], {type: "VALUE$OPERATOR$FIELD", field: "hoge", operator: "NOT_LIKE", value: "%xxx%"});
    t.deepEqual(x[0], {type: "VALUE$OPERATOR$FIELD", field: "hoge", operator: "IN", value: [98,99,100]});
    t.deepEqual(x[0], {type: "VALUE$OPERATOR$FIELD", field: "hoge", operator: "NOT_IN", value: [198,199,200]});
    t.deepEqual(x[0], {type: "VALUE$OPERATOR$FIELD", field: "hoge", operator: "BETWEEN", value: [1,2]});
    t.deepEqual(x[0], {type: "VALUE$OPERATOR$FIELD", field: "hoge", operator: "NOT_BETWEEN", value: [3,4]});
    t.is(1,1)
});
    