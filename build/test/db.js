"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTales = exports.dropTables = exports.query = exports.connection = void 0;
//import {connect} from "../database/connect";
const mysql_1 = __importDefault(require("mysql"));
const path_1 = __importDefault(require("path"));
//
// テスト用の .envを読み込む。
//
const envPath = path_1.default.resolve(process.cwd(), 'src/test/env-for-test');
require('dotenv').config({ path: envPath });
exports.connection = mysql_1.default.createConnection(process.env.DATABASE_URL || "oxoxoxox");
// QUERY
const query = (sql, replacements, logging) => {
    return new Promise((resolve, reject) => {
        const x = exports.connection.query(sql, replacements || {}, (err, res) => {
            if (err)
                reject(err);
            resolve(res);
        });
        logging && console.log(x.sql);
    });
};
exports.query = query;
// REPLACEMENTS
exports.connection.config.queryFormat = (query, placeholders) => {
    if (!placeholders)
        return query;
    // オブジェクト{} だったら :key の置換に使う。
    const x = query.replace(/[::|:@](\w+)/g, (txt, key) => {
        if (placeholders.hasOwnProperty(key)) {
            if (txt.substr(0, 1) === ":") {
                // 値として置き換える
                return exports.connection.escape(placeholders[key]);
            }
            else if (txt.substr(0, 1) === "@") {
                // フィールド名として置き換える
                return exports.connection.escapeId(placeholders[key]);
            }
            else {
                throw new Error("invalid");
            }
        }
        throw new Error(`database.js: "${txt}" に該当する値がplaceholdersに設定されていません。`);
        //return txt;
    });
    return x;
};
//
const dropTables = () => {
    return new Promise((resolve, reject) => {
        exports.connection.query(`
                DROP TABLE IF EXISTS XXXUsers
            `, (error, results) => {
            if (error)
                reject(error);
            return resolve(results);
        });
    });
};
exports.dropTables = dropTables;
//
const createTales = () => {
    return new Promise((resolve, reject) => {
        exports.connection.query(`
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
            `, (error, results) => {
            if (error)
                reject(error);
            return resolve(results);
        });
    });
};
exports.createTales = createTales;
