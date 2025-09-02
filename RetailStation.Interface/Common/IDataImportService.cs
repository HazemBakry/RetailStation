using RetailStation.Entities.Common;
using RetailStation.Entities.DTOs.DataImport;
using RetailStation.Entities.DTOs.HR;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Interface.Common
{
    public interface IDataImportService
    {
        List<ImporterDto> GetImporters(SearchFilterModel Model,int? ImporterId = null,string ImporterName="");
        ImporterDto GetImporterById(int ImporterId);
        ImporterDto GetImporterByName(string ImporterName);
        ActionsResponseModel AddNewImporter(ImporterDto model);
        ActionsResponseModel EditImporter(int ImporterId, ImporterDto model);
        ActionsResponseModel DeleteImporter(int ImporterId);
        ActionsResponseModel ExportTemplateByImporterId(int ImporterId);
        ActionsResponseModel ExportTemplateByImporterName(string ImporterName);
        Task<ActionsResponseModel> ExecuteImporterById(int ImporterId, [FromForm] FileImportDto model);
        Task<ActionsResponseModel> ExecuteImporterByName(string ImporterName, [FromForm] FileImportDto model);
        List<DBStoredProcedureDto> GetDBStoredProcedure(string SchemaName);
        List<DBTableDto> GetDBTables();

    }
}
