"use strict";
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const finder_1 = require("../finder");
ava_1.default.before(async () => {
    // nop
});
ava_1.default.beforeEach(async () => {
    // nop
});
ava_1.default.afterEach.always(async () => {
    // nop
});
ava_1.default.after(async () => {
    // nop
});
//
//
//
ava_1.default.serial("xxx", (t) => {
    const x = (0, finder_1.finder)({
        select: ["id", "name", "age", { XXX: "count(id)" }],
        from: "Users",
        where: [
            {
                age: { BETWEEN: [0, 10] },
                gender: { "=": "MALE" },
            },
            [
                { ext: { IN: ["CSV", "JSON"] } },
                "OR",
                [
                    { height: { IS_NOT: null } },
                    { weight: { IS_NOT: null } },
                ],
                "OR",
                { hasPet: { "=": true } },
                "xxxxxxxx"
            ]
        ]
    });
    console.log(x);
    t.is(1, 1);
});
