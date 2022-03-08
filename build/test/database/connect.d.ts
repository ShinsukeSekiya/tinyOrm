import { Database, MySQLConfig, Option } from './database';
export declare const connect: (params: {
    config: MySQLConfig;
    readReplicaConfig?: MySQLConfig;
    option?: Option;
}) => {
    master: Database;
    read: Database;
};
