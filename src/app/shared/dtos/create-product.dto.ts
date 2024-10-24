import { ItemsUnit } from "../services/unit.service";

export interface CreateProductDto {
    name: string;
    price: number;
    description: string;
    image: File;
    category: number,
    unit: number
}
