# tinyOrm


# ビルド
```
npm run build
```

# テスト
テストの時は `./src/test/test-for-env` が環境変数。
```
npm run ava
```

# 使い方
```
import * as types from "./types";
import * as tinyOrm from "tinyOrm";
import {Database} from "tinyOrm/database";

const db = new Database(config);
const User = tinyOrm.table<types.User>("Users");

db.transaction((t)=>{
    const users = User.select({
        fields: {maleCount: "COUNT(id)"},
        where: "gender = 'MALE' AND type='human' AND deletedAt IS NULL",
        groupBy: ["gender"]
    }, t);
    console.log(users.rows);

    const friends = tinyOrm.select<types.Friend>({
        fields: ["id","name"],
        from: "Friends",
        where: {deletedAt: {IS: null }, type: {"=": "HUMAN"}}
    });
    console.log(friends.rows);
})
```