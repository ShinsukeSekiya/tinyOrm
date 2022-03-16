export declare type User = {
    id: string | number;
    firstName: string;
    secondName: string;
    ext: 'XML' | 'JSON' | 'CSV' | 'TSV' | null;
    age: number;
    height: number | null;
    weight: number | null;
    gender: "MALE" | "FEMALE" | null;
    married: boolean | null;
    hasPet: boolean | null;
    deletedAt: Date | null;
    hoge: any;
    birthDay: Date;
};
