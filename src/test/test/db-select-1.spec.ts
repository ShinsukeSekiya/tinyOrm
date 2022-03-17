/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import test, { ExecutionContext } from "ava";
import {User} from "../types";
import * as tinyOrmCore from "../../";
import * as db from "../db";

test.before(async () => {
});

test.beforeEach(async () => {
    await db.dropTables();
    await db.createTales();
    const items = [
        { id:"1", firstName: "あ", secondName: "か", age: 10, gender: "MALE", ext: "CSV",       height: 50, weight: 10, hasPet: true, birthDay: new Date("2022-01-01") }, 
        { id:"2", firstName: "い", secondName: "き", age: 20, gender: "MALE", ext: "XML",       height: 50, weight: 50, hasPet: true, birthDay: new Date("2022-01-01") }, 
        { id:"3", firstName: "う", secondName: "く", age: 30, gender: "FEMALE", ext: "CSV",     height: 10, weight: 10, hasPet: true, birthDay: new Date("2022-01-01") }, 
        { id:"4", firstName: "え", secondName: "け", age: 40, gender: "FEMALE", ext: "XML",     height: 10, weight: 50, hasPet: true, birthDay: new Date("2022-01-01") },
        { id:"5", firstName: "お", secondName: "こ", age: 50, gender: "FEMALE", ext: "JSON",    height: 0, weight: 50, hasPet: false, birthDay: new Date("2022-01-01") }, 
    ];
    for( let item of items ){
        await db.query(`INSERT INTO XXXUsers SET :set;`, {set: item } );
    }
});

test.afterEach.always(async () => {
    // nop
});

test.after(async () => {
    // nop
});


//
test.serial("実際にDBにアクセス: SELECT", async (t) => {

    const [sql, replacements] = tinyOrmCore.select<User>({
        fields: ["id", "age"],
        from: "XXXUsers",
        where: {age: {"<=": 20}}
    });

    const res = await db.query(sql, replacements, false);
    
    t.is(res.length, 2);
    t.is(Object.keys(res[0]).length, 2), "idとageだけ";
    t.is(res[0].id, 1);
    t.is(res[0].age, 10);
    t.is(res[1].id, 2);
    t.is(res[1].age, 20);
});


//
test.serial("実際にDBにアクセス: SELECT、ORDER BY DESC", async (t) => {

    const [sql, replacements] = tinyOrmCore.select<User>({
        fields: "id, age",
        from: "XXXUsers",
        orderBy: {height: "DESC", weight: "DESC"},
    });

    const res = await db.query(sql, replacements, false);
    
    test10(t, res);
});

const test10 = ( t: ExecutionContext, res: any[] )=>{
    t.is(res[0].id, 2);
    t.is(res[1].id, 1);
    t.is(res[2].id, 4);
    t.is(res[3].id, 3);
    t.is(res[4].id, 5);
};

//
test.serial("実際にDBにアクセス: SELECT、ORDER BY DESC、を文字列で。", async (t) => {

    const [sql, replacements] = tinyOrmCore.select<User>({
        fields: "id, age",
        from: "XXXUsers",
        orderBy: "height DESC, weight DESC",
    });

    const res = await db.query(sql, replacements, false);
    
    test10(t, res);
});

//
test.serial("実際にDBにアクセス: SELECT GROUP BY と HAVING と SUM(リテラルな列)", async (t) => {

    type UserExt = User & {sum: number};
    const [sql, replacements] = tinyOrmCore.select<UserExt>({
        fields: ["ext",{sum: "SUM(age)"}],
        from: "XXXUsers",
        where: {hasPet: {IS: true}},
        grouBy: ["ext"],
        having: {ext: {IN: ["CSV","XML"]}},
    });

    const res = await db.query<UserExt>(sql, replacements, false);
    
    test20(t, res);
});

const test20 = ( t: ExecutionContext, res: any[] )=>{
    t.is(res.length, 2);
    t.is(res[0].ext, "XML");
    t.is(res[0].sum, 60);
    t.is(res[1].ext, "CSV");
    t.is(res[1].sum, 40);
};

//
test.serial("実際にDBにアクセス: SELECT GROUP BY と HAVING と SUM(リテラルな列) を文字列で。", async (t) => {

    type UserExt = User & {sum: number};
    const [sql, replacements] = tinyOrmCore.select<UserExt>({
        fields: "ext, SUM(age) AS sum",
        from: "XXXUsers",
        where: "hasPet IS true",
        grouBy: "ext",
        having: "ext IN ('CSV','XML')",
    });

    const res = await db.query<UserExt>(sql, replacements, false);
    
    test20(t, res);
});

//
test.serial("実際にDBにアクセス: SELECT LIMIT OFFSET", async (t) => {

    type UserExt = User & {sum: number};
    const [sql, replacements] = tinyOrmCore.select<UserExt>({
        fields: ["id"],
        from: "XXXUsers",
        offset: 2,
        limit: 1,
    });

    const res = await db.query<UserExt>(sql, replacements, false);
    
    t.is(res.length, 1);
    t.is(res[0].id, 3);
});