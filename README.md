# tinyOrm


# ビルド
```
npm run build
```

# 使い方
```
import * as tinyOrmCore from "tinyOrm";
import mysql from "mysql";

// npm mysql接続情報を設定
export const connection = mysql.createConnection(process.env.DATABASE_URL || "xxx");

// tinyOrmでクエリとplaceholderを作成
const [sql, replacements] = tinyOrmCore.select<User>({
    fields: ["id", "age"],
    from: "XXXUsers",
    where: {age: {"<=": 20}}
});

// npm mysqlでクエリ実行
const res = await new Promise<T[]>( (resolve, reject)=> {
    connection.query(sql, replacements, (err, res)=>{
      if(err) reject(err);
      resolve(res);
    });
});

// 結果
console.log(res[0].id); 
```

## select 
```
select<T>({
  fields: string | ( keyof T | "*" | {[alies:string]: string} )[], // { エイリアス名: 文字列 } で "文字列 AS エイリアス名" になる。
  from: string,
  where?: string | Condiction<T>
  offset?: number,
  limit?: numbber,
  orderBy?: string | {[keyof T]: "ASC" | "DESC"},
  groupBy?: string | (keyof T)[],   
  having?: string | Condiction<T>,
},{
  replacementKey1: replacementValue1,
  replacementKey2: replacementValue2,
  ....
}?)
```

### 例
```
    const [sql, replacements] = tinyOrmCore.select<User>({
        fields: ["id", "age", {fullName: "CONCAT(@REP1, @REP2)"}],
        from: "XXXUsers",
        where: [
            {
                age: {BETWEEN: [10,20]},
                gender: {"=": "MALE"},
            },
        ],
        orderBy: {age: "DESC"},
    },{
        REP1: "firstName",
        REP2: "secondName",
        REP3: 100,
    });
```

### 条件式： Condition<T>
#### 条件のオブジェクト
{列名: {演算子: 値}} は式になる。
```
// WHERE ( id = 100 )
{ where: {id: {"=": 100 }}
```
#### 複数の式はANDの関係
```
{ where: {id: {"=": 100, IS_NOT: null }}
{ where: {id: {"=": 100}, id: {IS_NOT: null }}
```
上記はいずれも以下と同じ。
```
WHERE ( id = 100 AND id IS NOT null )
```

### BETWEEN と IN
```
// WHERE age BETWEEN 0 AND 10
{ where: {age: {BETWEEN: [0,10]}}

// WHERE age IN (0, 1, 2, 3)
{ where: {age: {IN: [0,1,2,3]}}
```

#### 括弧とAND/OR
配列にすると括弧「()」になる。その際にAND/ORはそのまま演算子になる。
```
// WHERE (age > 100 AND (gender = "FEMALE" OR gender IS null))
{ where: [
  {age: {">": 100}},
  "AND",
  [{gender: {"=": "FEMALE"}}, "OR", {gender: {IS: null}}]
]}
```

#### 全文リテラル
※「ユーザーがplaceholderを定義」を参照
```
const [sql, replacements] = select<T>({
  select: ["*"],
  from "Users",
  where: "@myField > :myValue"
},{
  myField: "age",
  myNavlue: 100,
});
```

#### 部分的にリテラルな条件
※「ユーザーがplaceholderを定義」を参照
```
const [sql, replacements] = select<T>({
  select: ["*"],
  from "Users",
  where: [
    "@myField > :myValue", // リテラル
    "AND",
    {gender: {"=": "FEMALE"}},
  ]
},{
  myField: "age",
  myNavlue: 100,
});
```




# テスト
- DockerでMySqlを起動する。
- AVAを実行。
  - CREATE TABLEででテスト用のテーブルを作成される。
  - もろもろテスト実行される。

## テスト用のコンテナ起動
```
docker-compose up
```
### テスト用のDB確認
`TestDb`がテスト用のDB

```
$ mysql -u root -P 3309 -h 127.0.0.1
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 2

mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| TestDb             |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
5 rows in set (0.01 sec)
```

## envファイル
```
./src/test/test-for-env
```

## テスト実施
```
npm run ava
```

