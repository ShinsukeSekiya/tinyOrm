import * as types from "./types";
import {select, update, insert, remove} from "./"
import { Connection } from "./database/database";

//
//  テーブル（とタイプ）を指定してまとめてCRUDの処理を行えるマップを取得
//  
export const table = <T>( table: string )=>{
    return {
        select: ( connection: Connection, x: Omit<types.SelectParams<T>,"from">, replacements?: types.ReplacementMap )=>{
            const [sql, rep] = select<T>({ ...x, from: table }, replacements);
            return connection.query<T>(sql, rep);
        
        },
        update: ( connection: Connection, x: Omit<types.UpdateParams<T>,"table">, replacements?: types.ReplacementMap )=>{
            const [sql, rep] = update<T>({ ...x, table: table }, replacements);
            return connection.query<T>(sql, rep);
        },
        insert: ( connection: Connection, x: Omit<types.InsertParams<T>,"into">, replacements?: types.ReplacementMap )=>{
            const [sql, rep] = insert<T>({ ...x, into: table }, replacements);
            return connection.query<T>(sql, rep);
        },
        remove: ( connection: Connection, x: Omit<types.DeleteParams<T>,"from">, replacements?: types.ReplacementMap )=>{
            const [sql, rep] = remove<T>({ ...x, from: table }, replacements);
            return connection.query<T>(sql, rep);
        }
    }
};