export interface Category {
    _id: string;
    name: string;
    parent: { _id: string, name: string };
    specifications: { key: string, values: string[] }[];
    image: string;
}