"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
/*
export function get(): Config {

    return {
        
        server: {
            port: parseInt( process.env.PORT || "8080" ),
        },
        mysqlConfig: {
            database: process.env.DATABASE_DB || "",
            user: process.env.DATABASE_USER || "",
            password: process.env.DATABASE_PASSWORD || "",
            host: process.env.DATABASE_HOST,
            port: Number(process.env.DATABASE_PORT) || undefined,
            url: mysqlUrl,
            supportBigNumbers: true,
        },
        s3: {
          credentials: {
              secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
              accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
          },
          cdnBucket: process.env.S3_CDN_BUCKET || "",
          isMinio: process.env.S3_IS_MINIO === "yes" ,
        },
        cors: {
            origin: process.env.CORS_ORIGIN_URL || "",
        },
        
    };
}
*/ 
