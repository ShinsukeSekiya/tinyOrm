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
});

test.afterEach.always(async () => {
    // nop
});

test.after(async () => {
    // nop
});

test.serial("実際にDBにアクセス: INSERT（1件）", async (t) => {


    const [sql0, rep0] =  tinyOrmCore.insert<User>({
        into: "XXXUsers",
        values: {
            firstName: "苗字",
            secondName: "名前",
            age: 99,
            ext: "CSV",
            height: null,
            weight: 100,
            hasPet: true,
            birthDay: new Date("2022-01-01"),
        },
    });

    await db.query(sql0, rep0);

    const res = await db.query<User>(`SELECT * FROM XXXUsers`);
    t.is(res.length, 1);
    t.is(res[0].age, 99);
    t.is(res[0].firstName, "苗字");
    t.is(res[0].secondName, "名前");
    t.is(res[0].ext, "CSV");
    t.is(res[0].height, null);
    t.is(res[0].weight, 100);
    t.is(res[0].hasPet, true);
    t.is(res[0].birthDay.toISOString(), "2022-01-01T00:00:00.000Z")
});

//
test.serial("実際にDBにアクセス: INSERT（1万件）", async (t) => {
    const SIZE = 10000;
    const items: Omit<tinyOrmCore.InsertValues<User>[],"id"> = [];
    
    for( let i = 1; i<=SIZE; i++ ){
        items.push(
            { 
                firstName: `苗字${i}`,
                secondName: `名前${i}`, 
                age: i, 
                gender: "MALE", 
                ext: null, 
                height: null, 
                weight: null, 
                hasPet: true,
                birthDay: new Date("2022-01-01"),
            }, 
        );
    }
    // バルクインサート
    const [sql0, rep0] =  tinyOrmCore.insert<User>({
        into: "XXXUsers",
        values: items,
    });

    await db.query(sql0, rep0);

    const res = await db.query(`SELECT * FROM XXXUsers`);
    t.is(res[0].age, 1);
    t.is(res[4999].age, 5000);
    t.is(res[9999].age, 10000);

});

