/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import test, { ExecutionContext } from "ava";
import {User} from "./types";
//import * as tinyOrm from "../api";
import * as tinyOrmCore from "..";
import * as db from "./db";

test.before(async () => {
});

test.beforeEach(async () => {
    await db.dropTables();
    await db.createTales();
});

test.afterEach.always(async () => {
    // nop
});

test.after(async () => {
    // nop
});


test.serial("実際にDBにアクセス: UPDATE、10万件をCASEを使って個別にUPDATEする", async (t) => {
    const SIZE = 10
    const items: any[] = [];
    for( let i = 1; i<=SIZE; i++ ){
        items.push(
            { id: null, firstName: `苗字${i}`, secondName: `名前${i}`, age: 0, gender: "MALE", ext: null, height: null, weight: null, hasPet: true}, 
        );
    }
    console.log("!-2");

    const [sql0, rep0] =  tinyOrmCore.insert<User>({
        into: "XXXUsers",
        values: items,
    });

    console.log("!-1");
    await db.query(sql0, rep0);

    console.log("!0");
    const cases: tinyOrmCore.Case<User>[] = [];
    for( let i = 1; i<=SIZE; i++ ){
        // idごとに heightに値をふる。
        cases.push({when: {"id": {"=": i}}, then: i });
    }
    console.log("!1");
    const [sql, replacements] = tinyOrmCore.update<User>({
        table: "XXXUsers",
        set: { height: cases }
    });
    console.log("!2");
    await db.query(sql, { ...replacements,}, false,);
    const res = await db.query(`SELECT * FROM XXXUsers`);
    t.is(res[0].height, 1);
    t.is(res[4999].height, 5000);
    t.is(res[9999].height, 10000);

});

