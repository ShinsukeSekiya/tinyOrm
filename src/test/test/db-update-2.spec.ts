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

// 時間がかかるのでこのテストはSKIP
test.serial.skip("実際にDBにアクセス: UPDATE、大量の件数をCASEを使って個別にUPDATEする", async (t) => {
    const SIZE = 10000;
    const values: any[] = [];

    for( let i = 1; i<=SIZE; i++ ){
        values.push(`("苗字${i}", "名前${i}", 0, "MALE", NULL, NULL, NULL, false, "2022-01-01")`);
    }
    // バルクインサート
    await db.query(`INSERT INTO XXXUsers (firstName, secondName, age, gender, ext, height, weight, hasPet, birthDay) VALUES ${ values.join(", ")}`);

    const cases: tinyOrmCore.Case<User>[] = [];
    for( let i = 1; i<=SIZE; i++ ){
        // idごとに heightに値をふる。
        cases.push({when: {"id": {"=": i}}, then: i });
    }
 
    const [sql, replacements] = tinyOrmCore.update<User>({
        table: "XXXUsers",
        set: { height: cases }
    });

    await db.query(sql, { ...replacements,}, false,);
  
    const res = await db.query(`SELECT * FROM XXXUsers`);
    t.is(res[0].height, 1);
    t.is(res[4999].height, 5000);
    t.is(res[9999].height, 10000);

});

