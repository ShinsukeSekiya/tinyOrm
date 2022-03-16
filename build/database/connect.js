"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
const database_1 = require("./database");
//
//
//
const connect = (params) => {
    // マスター
    const master = new database_1.Database(params.config, params.option);
    // リードレプリカ設定（設定が無い場合マスターを利用）
    const read = params.readReplicaConfig ?
        new database_1.Database(params.readReplicaConfig, params.option)
        :
            master;
    return { master, read };
};
exports.connect = connect;
