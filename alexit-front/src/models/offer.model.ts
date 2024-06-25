export interface Offer {
    _id: string;
    category_id: string;
    title: string;
    featuredImage: string;
    content: { key: string, value: string[] }[];
    products: string[];
    discountImpact: { state: boolean, rate: number };
    expiration: string;
    published: boolean;
}