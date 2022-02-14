/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import test, { ExecutionContext } from "ava";
//import * as types from "../types";
import {User} from "./types";
import {
    find
} from "..";
import { Database } from "../database/database";

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
test.serial("xxx", (t) => {
    const x = find<User>({
        select: ["id","name","age",{XXX: "count(id)"}],
        from: "Users",
        where: [
            {
                age: {BETWEEN: [0,10]},
                gender: {"=": "MALE"},
            },
            [
                {ext: {IN: ["CSV","JSON"]}},
                "OR", 
                [
                    {height: {IS_NOT: null}},
                    {weight: {IS_NOT: null}},
                ],
                "OR",
                { hasPet: {"=": true}},
                "xxxxxxxx"
            ]
        ]
    });
    console.log(x);
    t.is(1,1)
});

const tinyOrm = (db: Database, readDb: Database)=>{
    User: {
        find: ()=>find<User>({from: "Users"})
    }
};

