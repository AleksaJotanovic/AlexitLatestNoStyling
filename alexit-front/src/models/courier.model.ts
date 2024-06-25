export interface Courier {
    _id: string;
    name: string;
    pricelist: { weight: { min: number; max: number }, price: number }[];
}