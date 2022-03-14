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


test.serial("実際にDBにアクセス: REPLACEMENTS をユーザーが指定する", async (t) => {
    const items = [
        { id:"1", firstName: "苗字1", secondName: "A", age: 0, gender: "MALE", hasPet: true}, 
        { id:"2", firstName: "苗字2", secondName: "B", age: 0, gender: "MALE", hasPet: true}, 
        { id:"3", firstName: "苗字3", secondName: "C", age: 0, gender: "MALE", hasPet: true}, 
        { id:"4", firstName: "苗字4", secondName: "D", age: 0, gender: "MALE", hasPet: null}, // 対象外
        { id:"5", firstName: "苗字5", secondName: "E", age: 0, gender: null, hasPet: true},  // 対象外
    ];
    for( let item of items ){
        await db.query(`INSERT INTO XXXUsers SET :set;`, {set: item } );
    }

    const [sql, replacements] = tinyOrmCore.select<User & {fullName: "fullName"}>({
        fields: ["id", {fullName: "CONCAT(@aaa, @bbb)"}, {hoge: ":hoge"}],
        from: "XXXUsers",
        where: [
            {hasPet: {IS_NOT: null}},
            "AND",
            "@ddd IS NOT :ccc"
        ]
    });
    const res = await db.query(
        sql, 
        {
            ...replacements,
            hoge: "固定値ほげ",
            aaa: "firstName",
            bbb: "secondName",
            ccc: null,
            ddd: "gender",
        }, 
        false,
    );

    t.is( res.length, 3);
    t.is( res[0].id, 1);
    t.is( res[0].fullName, "苗字1A");
    t.is( res[0].hoge, "固定値ほげ");
    t.is( res[1].id, 2);
    t.is( res[1].fullName, "苗字2B");
    t.is( res[1].hoge, "固定値ほげ");
    t.is( res[2].id, 3);
    t.is( res[2].fullName, "苗字3C");
    t.is( res[2].hoge, "固定値ほげ");
});
