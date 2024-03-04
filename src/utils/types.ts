
export interface Item{
    name: string;
    price: number;
    id?: number;
    description?: string;
}

export interface ItemOption{
    option_name: string;
    option_value: string | number | boolean;
    available: boolean;
    default: boolean;
}

export interface ItemOptionContainer{
    item: Item;
    options: ItemOption[];
}