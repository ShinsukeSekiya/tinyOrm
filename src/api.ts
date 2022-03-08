import * as types from "./types";
import {select, update, insert, remove} from "./"
import { Connection } from "./database/database";

//
//  テーブル（とタイプ）を指定してまとめてCRUDの処理を行えるマップを取得
//  
export const table = <T>( table: string )=>{
    return {
        select: ( x: Omit<types.SelectParams<T>,"from">, connection: Connection )=>{
            const [sql, rep] = select<T>({ ...x, from: table });
            return connection.query<T>(sql, rep);
        
        },
        update: ( x: Omit<types.UpdateParams<T>,"table">, connection: Connection )=>{
            const [sql, rep] = update<T>({ ...x, table: table });
            return connection.query<T>(sql, rep);
        },
        insert: ( x: Omit<types.InsertParams<T>,"into">, connection: Connection )=>{
            const [sql, rep] = insert<T>({ ...x, into: table });
            return connection.query<T>(sql, rep);
        },
        remove: ( x: Omit<types.DeleteParams<T>,"from">, connection: Connection )=>{
            const [sql, rep] = remove<T>({ ...x, from: table });
            return connection.query<T>(sql, rep);
        }
    }
};