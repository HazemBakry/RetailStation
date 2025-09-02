export interface DBStoredProcedureModel {
    schemaName: string;
    dBName: string;
    storedProcedureName: string;
}
export interface DBTableModel {
    schemaName: string;
    dBName: string;
    tableName: string;
    columns: DBColumnModel[];
}

export interface DBColumnModel {
    columnName: string;
    dataType: string;
    isNullable: boolean | null;
    characterMaximumLength: number | null;
}