import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SearchFilterModel } from '../../Shared/models/FilterModel';
import { Observable } from 'rxjs';
import { PagedResponseDTO } from '../../Shared/models/PagedResponseDTO';
import { ActionsResponseModel } from '../../Shared/models/ActionsResponseModel';
import { AddUserRoleModel, RoleModel } from '../../Shared/models/RoleModel';
import { DBStoredProcedureModel, DBTableModel } from '../models/DBTableModel';
import { ImporterModel } from '../models/DataImporter';

@Injectable({
  providedIn: 'root'
})
export class DataImportersService {
  URL = environment.apiURL;
  constructor(private http: HttpClient) 
  {
  }

  GetImporters(model: PagedResponseDTO):Observable<PagedResponseDTO<ImporterModel[]>> {
    return this.http.post<PagedResponseDTO<ImporterModel[]>>(this.URL + 'DataImport/GetImporters', model);
  }
  GetImporterById(importerId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'DataImport/GetImporterById?ImporterId='+ importerId);
  }
  GetImporterByName(importerName: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'DataImport/GetImporterByName?ImporterName='+ importerName);
  }

  AddNewImporter(model: ImporterModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'DataImport/AddNewImporter', model);
  }
  EditImporter(importerId,model: ImporterModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'DataImport/EditImporter?ImporterId='+ importerId, model);
  }
  DeleteImporter(importerId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'DataImport/DeleteImporter?ImporterId='+ importerId);
  }

  ExportTemplateByImporterId(importerId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'DataImport/ExportTemplateByImporterId?ImporterId='+ importerId);
  }
  ExportTemplateByImporterName(importerName: string) {
    return this.http.get<ActionsResponseModel>(this.URL + 'DataImport/ExportTemplateByImporterName?ImporterName='+ importerName);
  }
  ExportTemplateByImporterLookup(importerName: string) {
    return this.http.get<ActionsResponseModel>(this.URL + 'DataImport/ExportTemplateByImporterLookup?ImporterName='+ importerName);
  }
  GetDBStoredProcedure(SchemaName) {
    return this.http.get<DBStoredProcedureModel[]>(this.URL + 'DataImport/GetDBStoredProcedure?SchemaName='+ SchemaName);
  }
  GetDBTables() {
    return this.http.get<DBTableModel[]>(this.URL + 'DataImport/GetDBTables');
  }
  ExecuteImporterById(importerId:number,model: FormData) {
    return this.http.post<ActionsResponseModel>(this.URL + `DataImport/ExecuteImporterById?ImporterId=${importerId}`, model);
  }
  ExecuteImporterByName(importerName:string,model: FormData) {
    return this.http.post<ActionsResponseModel>(this.URL + `DataImport/ExecuteImporterByName?ImporterName=${importerName}`, model);
  }
}
