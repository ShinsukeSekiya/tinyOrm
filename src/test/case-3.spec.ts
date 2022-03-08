/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import test, { ExecutionContext } from "ava";
//import * as types from "../types";
import {User} from "./types";
import * as tinyOrm from "../api";

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
test.serial("table", (t) => {
    const User = tinyOrm.table<User>("Users");
    t.is(1,1)
});
    