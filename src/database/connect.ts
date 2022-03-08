

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
