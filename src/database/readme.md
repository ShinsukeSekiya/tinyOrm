
# 概要
`npm mysql`のラッパー。
トランザクションが1つのコールバック内で行われる。コールバックの処理が完了すると自動的にcommitできる。

# usage
## connect
DBの接続

```
connect( params: {
    config: MySQLConfig,
    readReplicaConfig?: MySQLConfig,
    option?: Option,
}): {
    master: Database
    read: Database
}
```

### sample
```
export const db = connect({
    config: {
        url: process.env.DATABASE_URL 
    },
    option: {
        usePlaceHolderAsKeyValue: true,
        logging: true,
        logger: console.log,
    }
})
```

### MySQLConfig
DBの接続情報

```
{ username: string, password: string, database: string, host: string, port?: number } 
```
または、
```
{ url: string }
```
### nreadReplicaConfig
リードレプリカの接続情報
configと同じ。

### Option
```
{
    // プレーフォルダの使い方。true=> クエリで「:key」プレースホルダで {key: 値}、false=> クエリで「?」プレースホルダで [値]。
    usePlaceHolderAsKeyValue: boolean,
    // SQL実行のログを出力するか
    logging: boolean,
    // ロガー
    logger: (x: string)=>void,
}
```