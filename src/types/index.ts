export interface Product {
    name: string;
    description: string;
    images: string[];
    price: Price
    stock: Stock
    category: Category
}

export interface Price{
    price: number;                
    discountedPrice?: number;
    currency: string; 
}

export interface Stock{
    stock: number;               
    stockStatus: "in stock" | "out of stock";
}

export interface Category{
    category: string;  
    subCategory?: string[];
    tags?: string[];   
}