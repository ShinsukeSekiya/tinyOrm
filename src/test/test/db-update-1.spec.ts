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
        { id:"1", firstName: "苗字1", secondName: "A", age: 0, gender: "MALE", ext: null, height: 50, weight: 50, hasPet: true, birthDay: new Date("2022-01-01")}, 
        { id:"2", firstName: "苗字2", secondName: "B", age: 0, gender: "MALE", ext: null, height: 50, weight: 50, hasPet: true, birthDay: new Date("2022-01-01")}, 
        { id:"3", firstName: "苗字3", secondName: "C", age: 0, gender: "MALE", ext: null, height: 50, weight: 50, hasPet: true, birthDay: new Date("2022-01-01")}, 
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


test.serial("実際にDBにアクセス: UPDATE、個別に実施", async (t) => {
    // id = 1
    const [sql1, replacements1] = tinyOrmCore.update<User>(
        { table: "XXXUsers", set: {age: 100, ext: "CSV"}, where: {id: {"=": 1}} },
    );
    await db.query(sql1, { ...replacements1,}, false,);
    // id = 2
    const [sql2, replacements2] = tinyOrmCore.update<User>(
        { table: "XXXUsers", set: {age: 200, ext: "XML"}, where: {id: {"=": 2}} },
    );
    await db.query(sql2, { ...replacements2,}, false,);

    const res = await db.query(`SELECT * FROM XXXUsers`);
    test10(t, res);
});

const test10 = (t: ExecutionContext, res: any[])=>{
    t.is(res[0].age, 100);
    t.is(res[0].ext, "CSV");
    t.is(res[1].age, 200);
    t.is(res[1].ext, "XML");
    t.is(res[2].age, 0);
    t.is(res[2].ext, null);
}

test.serial("実際にDBにアクセス: UPDATE、個別に実施 を文字列で。", async (t) => {
    // id = 1
    const [sql1, replacements1] = tinyOrmCore.update<User>(
        { table: "XXXUsers", set: "age = 100, ext = 'CSV'", where: "id = 1" },
    );
    await db.query(sql1, { ...replacements1,}, false,);
    // id = 2
    const [sql2, replacements2] = tinyOrmCore.update<User>(
        { table: "XXXUsers", set: "age = 200, ext = 'XML'", where: "id = 2" },
    );
    await db.query(sql2, { ...replacements2,}, false,);

    const res = await db.query(`SELECT * FROM XXXUsers`);
    test10(t, res);
});


//
test.serial("実際にDBにアクセス: UPDATE CASEを使って1文で。", async (t) => {

    const [sql, replacements] = tinyOrmCore.update<User>(
        {
            table: "XXXUsers",
            set: {
                age: [
                    {when: {id: {"=": 1 }}, then: 100 },
                    {when: {id: {"=": 2 }}, then: 200 },
                    {elseField: "age"},
                ],
                ext: [
                    {when: {id: {"=": 1 }}, then: "CSV" },
                    {when: {id: {"=": 2 }}, then: "XML" },
                    {elseField: "ext"},
                ],
            },
        },
    );

    await db.query(sql, { ...replacements,}, false,);
    const res = await db.query(`SELECT * FROM XXXUsers`);
    test10(t, res);
});

