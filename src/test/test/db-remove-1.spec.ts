/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import test, { ExecutionContext } from "ava";
import {User} from "../types";
import * as tinyOrmCore from "../..";
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


test.serial("実際にDBにアクセス: REMOVE", async (t) => {
    const SIZE = 3;
    const values: any[] = [];

    values.push(`("苗字1", "名前1", 0, "MALE", NULL, NULL, NULL, false, "2022-01-01")`);
    values.push(`("苗字2", "名前2", 10, "MALE", NULL, NULL, NULL, false, "2022-01-01")`);
    values.push(`("苗字3", "名前3", 20, "MALE", NULL, NULL, NULL, false, "2022-01-01")`);
    // バルクインサート
    await db.query(`INSERT INTO XXXUsers (firstName, secondName, age, gender, ext, height, weight, hasPet, birthDay) VALUES ${ values.join(", ")}`);


    const [sql, replacements] = tinyOrmCore.remove<User>({
        from: "XXXUsers",
        where: {id: {"=": 1}},
    });

    await db.query(sql, { ...replacements,}, false);
  
    const res = await db.query(`SELECT * FROM XXXUsers`);
    t.is(res.length, 2);
    t.is(res[0].id, 2);
    t.is(res[1].id, 3);

});

