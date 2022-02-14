

import { Database, MySQLConfig, Option } from './database';

//
//
//
export const connect = ( params: {
    config: MySQLConfig,
    readReplicaConfig?: MySQLConfig,
    option?: Option,
})=>{
    // マスター
    const master = new Database(params.config, params.option);
	// リードレプリカ設定（設定が無い場合マスターを利用）
	const read = params.readReplicaConfig ?
                    new Database(params.readReplicaConfig, params.option)
                    :
                    master;
    return {master, read};
};

/*
export const db = connect({
    config: {
        url: process.env.DATABASE_URL 
    },
    option: {
        // プレーフォルダの使い方。true=> クエリで「:key」プレースホルダで {key: 値}、false=> クエリで「?」プレースホルダで [値]。
        usePlaceHolderAsKeyValue: true,
        // SQL実行のログを出力するか
        logging: true,
        // ロガー
        logger: console.log,
    }
})
*/