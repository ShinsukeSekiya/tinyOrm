//import {connect} from "../database/connect";
import mysql from "mysql";
import path from "path";

//
// テスト用の .envを読み込む。
//
const envPath = path.resolve(process.cwd(), 'src/test/env-for-test');
require('dotenv').config({ path: envPath });

export const connection = mysql.createConnection(process.env.DATABASE_URL || "oxoxoxox");

// QUERY
export const query = <T = any>(sql: string, replacements?: any, logging?: boolean)=>{
    return new Promise<T[]>( (resolve, reject)=> {
        const x = connection.query(
            sql,
            replacements || {}, 
            (err, res)=>{
                if(err) reject(err);
                resolve(res);
            }
        )
        logging && console.log(x.sql);
    });
}


// REPLACEMENTS
connection.config.queryFormat = (query, placeholders:undefined|{[key:string]:any})=>{
    if (!placeholders) return query;
    // オブジェクト{} だったら :key の置換に使う。
    const x = query.replace(/[::|:@](\w+)/g, (txt, key)=>{
        if (placeholders.hasOwnProperty(key)) {
            if ( txt.substr(0,1) === ":" ){
                // 値として置き換える
                return connection.escape(placeholders[key]);
            } else if ( txt.substr(0,1) === "@" ){
                // フィールド名として置き換える
                return connection.escapeId(placeholders[key]);
            } else {
                throw new Error("invalid");
            }
        }
        throw new Error(`database.js: "${txt}" に該当する値がplaceholdersに設定されていません。`)
        //return txt;
    });
    return x;
};

//
export const dropTables = ()=>{
    return new Promise( (resolve, reject)=>{
        connection.query(
            `
                DROP TABLE IF EXISTS XXXUsers
            `,
            (error, results)=>{
                if (error) reject(error);
                return resolve(results);
            }
        );    
    });
};

//
export const createTales = ()=>{
    return new Promise( (resolve, reject)=>{
        connection.query(
            `
                CREATE TABLE \`XXXUsers\` (
                \`id\` int(11) unsigned NOT NULL AUTO_INCREMENT,
                \`firstName\` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
                \`secondName\` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
                \`ext\` enum('XML','JSON','CSV','TSV') COLLATE utf8_unicode_ci DEFAULT NULL,
                \`age\` int(11) NOT NULL,
                \`height\` int(11) DEFAULT NULL,
                \`weight\` int(11) DEFAULT NULL,
                \`gender\` enum('MALE','FEMALE') COLLATE utf8_unicode_ci DEFAULT NULL,
                \`married\` tinyint(1) DEFAULT NULL,
                \`hasPet\` tinyint(1) DEFAULT NULL,
                \`deletedAt\` date DEFAULT NULL,
                PRIMARY KEY (\`id\`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
            `,
            (error, results)=>{
                if (error) reject(error);
                return resolve(results);
            }
        );    
    });
};