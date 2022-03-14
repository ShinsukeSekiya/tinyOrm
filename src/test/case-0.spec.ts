/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import test, { ExecutionContext } from "ava";
import * as types from "../types";
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
test.serial("WHEREの条件オブジェクト", async (t) => {
    const x = normalizeConditions<User>(
        {
            firstName: {"=": "a", IS: "b"},
            age: {">": 0, "<": 10},
            married: {"=": true},
            ext: {IN: ["CSV","JSON"], NOT_IN: ["TSV","XML"]},
        }
    );
    t.deepEqual(x[0], {type:"VALUE$OPERATOR$FIELD", field: "firstName", operator: "=", value: "a",});
    t.deepEqual(x[1], {type:"VALUE$OPERATOR$FIELD", field: "firstName", operator: "IS", value: "b",});
    t.deepEqual(x[2], {type:"VALUE$OPERATOR$FIELD", field: "age", operator: ">", value: 0,});
    t.deepEqual(x[3], {type:"VALUE$OPERATOR$FIELD", field: "age", operator: "<", value: 10,});
    t.deepEqual(x[4], {type:"VALUE$OPERATOR$FIELD", field: "married", operator: "=", value: true,});
    t.deepEqual(x[5], {type:"VALUE$OPERATOR$FIELD", field: "ext", operator: "IN", value: ["CSV","JSON"],});
    t.deepEqual(x[6], {type:"VALUE$OPERATOR$FIELD", field: "ext", operator: "NOT_IN", value: ["TSV","XML"],});
});

//
//
//
test.serial("配列内の多層構造WHEREの条件オブジェクト", async (t) => {
    const x = normalizeConditions<User>(
        [
            {
                firstName: {"=": "a", IS: "b"},
                age: {">": 0, "<": 10},
            },
            "AND",
            { married: {"=": true}, },
            "OR",
            { ext: {IN: ["CSV","JSON"], NOT_IN: ["TSV","XML"]}, },
            [
                { height: {">": 0, "<": 10}, },
                "OR",
                [
                    { weight: {">": 0, "<": 10}, }
                ]
            ]
        ]
    );

    t.is(x[0].type, "GROUP");
    const x0 = (x[0] as any).conditions as types.NormalizedCondition<User>[];
    t.deepEqual(x0[0], {type:"VALUE$OPERATOR$FIELD", field: "firstName", operator: "=", value: "a",});
    t.deepEqual(x0[1], {type:"VALUE$OPERATOR$FIELD", field: "firstName", operator: "IS", value: "b",});
    t.deepEqual(x0[2], {type:"VALUE$OPERATOR$FIELD", field: "age", operator: ">", value: 0,});
    t.deepEqual(x0[3], {type:"VALUE$OPERATOR$FIELD", field: "age", operator: "<", value: 10,});
    t.deepEqual(x0[4], {type:"CONJUNCTION", andor: "AND",});
    t.deepEqual(x0[5], {type:"VALUE$OPERATOR$FIELD", field: "married", operator: "=", value: true,});
    t.deepEqual(x0[6], {type:"CONJUNCTION", andor: "OR",});
    t.deepEqual(x0[7], {type:"VALUE$OPERATOR$FIELD", field: "ext", operator: "IN", value: ["CSV","JSON"],});
    t.deepEqual(x0[8], {type:"VALUE$OPERATOR$FIELD", field: "ext", operator: "NOT_IN", value: ["TSV","XML"],});
    t.is(x0[9].type, "GROUP");
    const x09 = (x0[9] as any).conditions as types.NormalizedCondition<User>[];
    t.deepEqual(x09[0], {type:"VALUE$OPERATOR$FIELD", field: "height", operator: ">", value: 0,});
    t.deepEqual(x09[1], {type:"VALUE$OPERATOR$FIELD", field: "height", operator: "<", value: 10,});
    t.deepEqual(x09[2], {type:"CONJUNCTION", andor: "OR",});
    t.is(x09[3].type, "GROUP");
    const x093 = (x09[3] as any).conditions as types.NormalizedCondition<User>[];
    t.deepEqual(x093[0], {type:"VALUE$OPERATOR$FIELD", field: "weight", operator: ">", value: 0,});
    t.deepEqual(x093[1], {type:"VALUE$OPERATOR$FIELD", field: "weight", operator: "<", value: 10,});
});