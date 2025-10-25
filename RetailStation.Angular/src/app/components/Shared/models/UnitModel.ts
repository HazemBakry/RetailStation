import { CreatorModel } from "src/app/components/Shared/models/CreatorModel";

export interface UnitModel extends CreatorModel{
    unitId?: number;
    code?: string;
    nameAR?: string;
    nameEN?: string;
    isActive?: boolean;
    description?: string;
}
