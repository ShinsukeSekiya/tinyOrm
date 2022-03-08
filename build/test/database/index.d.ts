export interface MySQLUrl {
    url: string;
}
export interface MySQLConfig {
    database?: string;
    user?: string;
    password?: string;
    host?: string;
    port?: number;
    url?: string;
    timezone?: string;
}
interface AWSCredentials {
    secretAccessKey: string;
    accessKeyId: string;
}
export interface S3Config {
    credentials: AWSCredentials;
    isMinio: boolean;
}
interface CORSConfig {
    origin: string;
}
interface ServerConfig {
    port: number;
}
export interface Config {
    server: ServerConfig;
    mysqlConfig: MySQLConfig;
    s3: S3Config;
    cors: CORSConfig;
}
export {};
