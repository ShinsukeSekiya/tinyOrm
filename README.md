# tinyOrm


# ビルド
```
npm run build
```

# 使い方
```
import * as types from "./types";
import * as tinyOrm from "tinyOrm";
import {Database} from "tinyOrm/database";

const db = new Database(config);
const replacements = {
    FIELD: "lastName",
};

const [sql, rep] = select<T>({
    fields: ["id",{fullName: "CONCAT(`firstName`, @FIELD)"}],
    where: 
}, replacements);
connection.query<T>(sql, rep);
```

# テスト
- DockerでDBのコンテナを起動する。
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

