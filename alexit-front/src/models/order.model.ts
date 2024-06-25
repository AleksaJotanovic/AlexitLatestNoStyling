export interface Order {
    _id: string;
    number: string;
    user: { _id: string, username: string, note: string }
    courier: { _id: string, name: string };
    pcBuild: boolean;
    pcBuildName: string;
    status: string;
    paymentMethod: { creditCard: boolean; cashOnDelivery: boolean; };
    paid: boolean;
    shipping: { country: string; city: string; street: string; zip: string; phone: string; email: string; };
    items: { product_id: string; image: string, name: string, price: number, quantity: number, weight: number }[];
    weight: number;
    subtotal: number;
    shippingCost: number;
    grandTotal: number;
    creationTime: string;
    accountingSent: boolean;
    saleGenerated: boolean;
}