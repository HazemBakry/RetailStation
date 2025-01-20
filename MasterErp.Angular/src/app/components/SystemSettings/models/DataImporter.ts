import { CreatorModel } from "../../Shared/models/CreatorModel";


export interface ImporterModel extends CreatorModel {
    importerId: number | null;
    importerName: string;
    importerType: string;
    templatePath: string;
    destinationStoredProcedure: string;
    totalCount: number | null;
    columns: ImporterColumnModel[];
}

export interface ImporterColumnModel extends CreatorModel {
    importerColumnId?: number | null;
    importerId?: number | null;
    columnName: string;
    dataType?: string;
    isRequired?: boolean | null;
    displayOrder?: number | null;
    importers?: ImporterModel;
    isNullable? : boolean;
}


export interface FileImportModel
{
    importerId:number;
    importerName:string;
    file: File;
}