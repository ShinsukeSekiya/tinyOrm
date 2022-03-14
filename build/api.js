"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.table = void 0;
const _1 = require("./");
//
//  テーブル（とタイプ）を指定してまとめてCRUDの処理を行えるマップを取得
//  
const table = (table) => {
    return {
        select: (connection, x, replacements) => {
            const [sql, rep] = (0, _1.select)(Object.assign(Object.assign({}, x), { from: table }), replacements);
            return connection.query(sql, rep);
        },
        update: (connection, x, replacements) => {
            const [sql, rep] = (0, _1.update)(Object.assign(Object.assign({}, x), { table: table }), replacements);
            return connection.query(sql, rep);
        },
        insert: (connection, x, replacements) => {
            const [sql, rep] = (0, _1.insert)(Object.assign(Object.assign({}, x), { into: table }), replacements);
            return connection.query(sql, rep);
        },
        remove: (connection, x, replacements) => {
            const [sql, rep] = (0, _1.remove)(Object.assign(Object.assign({}, x), { from: table }), replacements);
            return connection.query(sql, rep);
        }
    };
};
exports.table = table;
