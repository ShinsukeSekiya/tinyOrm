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


//
//
//
test.serial("実際にDBにアクセス: SELECT、複雑なWHERE", async (t) => {

    const items = [
        { id:"1", firstName: "はずれ", secondName: "A", age: 0, gender: "MALE", ext: "CSV", height: 50, weight: 50, hasPet: false}, // ageが範囲外
        { id:"2", firstName: "あたり", secondName: "B", age: 10, gender: "MALE", ext: "CSV", height: 50, weight: 50, hasPet: false}, // 
        { id:"3", firstName: "はずれ", secondName: "C", age: 15, gender: "FEMALE", ext: "CSV", height: 50, weight: 50, hasPet: false}, // genderがFEMALE
        { id:"4", firstName: "はずれ", secondName: "D", age: 15, gender: "MALE", ext: "XML", height: 50, weight: 50, hasPet: false}, // extがXML
        { id:"5", firstName: "あたり", secondName: "E1", age: 14, gender: "MALE", ext: "JSON", height: 50, weight: 50, hasPet: false}, // 
        { id:"6", firstName: "あたり", secondName: "E2", age: 15, gender: "MALE", ext: "XML", height: 50, weight: 50, hasPet: true}, // hasPetがtrue
        { id:"7", firstName: "あたり", secondName: "F1", age: 20, gender: "MALE", ext: "XML", height: 100, weight: 100, hasPet: false}, // heightとweightが100超え
        { id:"8", firstName: "はずれ", secondName: "F2", age: 20, gender: "MALE", ext: "XML", height: 100, weight: 50, hasPet: false}, // heightは100超えだけどwidthが足りない
        { id:"9", firstName: "はずれ", secondName: "G", age: 30, gender: "MALE", ext: "CSV", height: 50, weight: 50, hasPet: false} // ageが範囲外
    ];
    for( let item of items ){
        await db.query(`INSERT INTO XXXUsers SET :set;`, {set: item } );
    }

    //
    const [sql, replacements] = tinyOrmCore.select<User>({
        fields: ["id", "age", {fullName: "CONCAT(@REP1, @REP2)"}],
        from: "XXXUsers",
        where: [
            {
                age: {BETWEEN: [10,20]},
                gender: {"=": "MALE"},
            },
            [
                {ext: {IN: ["CSV","JSON"]}},
                "OR", 
                [
                    {height: {">=": 100}},
                    "weight >= :REP3", // リテラルな条件
                ],
                "OR",
                { hasPet: {IS: true}},
            ]
        ],
        orderBy: {age: "DESC"},
    },{
        REP1: "firstName",
        REP2: "secondName",
        REP3: 100,
    });

    //
    const res = await db.query(sql, replacements, false);
    //console.log(res);
    
    t.is(res.length, 4);
    t.is(res[0].id, 7, "ORDER BYで age が最も大きいものが先頭になる");
    t.is(res[0].fullName, "あたりF1");
    t.is(res[1].id, 6);
    t.is(res[1].fullName, "あたりE2");
    t.is(res[2].id, 5);
    t.is(res[2].fullName, "あたりE1");
    t.is(res[3].id, 2);
    t.is(res[3].fullName, "あたりB");
});
