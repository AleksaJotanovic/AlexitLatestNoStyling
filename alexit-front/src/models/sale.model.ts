export interface Sale {
    _id: string;
    group: { _id: string, name: string };
    uom: string;
    articleCode: string;
    articleName: string;
    quantity: number;
    purchasePrice: number;
    margin: number;
    pricePerUom: number;
    taxBase: number;
    vatRate: number;
    vat: number;
    saleValue: number;
    earned: number;
    createdAt: string;
}