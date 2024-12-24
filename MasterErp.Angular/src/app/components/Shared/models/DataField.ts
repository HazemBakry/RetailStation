import { FieldType } from "../Enums/FieldType";

export interface DataField
{
    fieldName: string;
    fieldType?: FieldType;
    displayName: string;
    displayBehavior?: string;

}