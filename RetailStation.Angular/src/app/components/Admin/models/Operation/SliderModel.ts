import { CreatorModel } from "src/app/components/Shared/models/CreatorModel";

export interface SliderModel extends CreatorModel {
    sliderId: number | null;
    title: string;
    description: string | null;
    image: File | null;
    imageUrl: string; orderNo: number;
    isActive: boolean;
    totalCount?: number;
}