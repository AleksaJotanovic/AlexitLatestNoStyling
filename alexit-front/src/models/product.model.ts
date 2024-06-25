export interface Product {
    _id: string;
    category: { _id: string, name: string };
    name: string;
    uom: string;
    sku: string;
    price: { margin: number; purchase: number; regular: number; sale: number; earning: number; onDiscount: { state: boolean; rate: number; }; }
    images: string[];
    specifications: { key: string, value: string }[];
    inStock: number;
    weight: number;
    garantee: string;
    published: boolean;
}