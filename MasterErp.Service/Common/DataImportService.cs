using MasterErp.Entities.Common.Enums;
using MasterErp.Entities.Common.Export;
using MasterErp.Entities.Common;
using MasterErp.Interface.Common;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using MasterErp.Entities.Models;
using Microsoft.Data.SqlClient;
using MasterErp.Entities.Common.Finance.GeneralAccounts;
using MasterErp.Entities.DTOs.DataImport;
using Microsoft.Identity.Client;
using MasterErp.Entities.Models.DataImport;
using System.Data.Entity;

namespace MasterErp.Service.Common
{
    public class DataImportService : IDataImportService
    {
        private readonly DBContext Context;
        private readonly ISQLHelper SQLHelper;
        private readonly IConfiguration Configuration;
        private readonly IExportService _exportService;
        private readonly string ConnectionString;
        private readonly IFileService FileService;
        public readonly string ImportersFolderName;

        public DataImportService(DBContext dBContext, ISQLHelper iSQLHelper, IConfiguration _configuration, IExportService exportService, IFileService fileService)
        {
            Context = dBContext;
            SQLHelper = iSQLHelper;
            Configuration = _configuration;
            _exportService = exportService;
            ConnectionString = Configuration.GetConnectionString("DBConnection");
            ImportersFolderName = "Importers";
            FileService = fileService;
        }

        public List<ImporterDto> GetImporters(SearchFilterModel SearchModel, int? ImporterId = null, string ImporterName = "")
        {
            var totalCount = 0;

            if(ImporterId == null&& string.IsNullOrEmpty(ImporterName))
                totalCount=Context.Importers.Count(); // get total count only when get all data

            var query = Context.Importers.AsQueryable();
            if (ImporterId != null)
                query = query.Where(t => t.ImporterId == ImporterId);

            if (!string.IsNullOrEmpty(ImporterName))
                query = query.Where(t => t.ImporterName.ToLower()== ImporterName.ToLower());


            var importers = query
                               .Include(t => t.Columns)
                               .Skip((SearchModel.CurrentPage - 1) * SearchModel.PageSize)
                               .Take(SearchModel.PageSize)
                               .Select(template => new ImporterDto
                               {
                                   ImporterId = template.ImporterId,
                                   ImporterName = template.ImporterName,
                                   ImporterType = template.ImporterType,
                                   TemplatePath = template.TemplatePath,
                                   DestinationStoredProcedure = template.DestinationStoredProcedure,
                                   CreatedBy = template.CreatedBy,
                                   CreatedDate = template.CreatedDate,
                                   ModifiedBy = template.ModifiedBy,
                                   ModifiedDate = template.ModifiedDate,
                                   TotalCount=totalCount,
                                   Columns = template.Columns.Select(f => new ImporterColumnDto
                                   {
                                       ImporterColumnId = f.ImporterColumnId,
                                       ColumnName = f.ColumnName,
                                       DataType = f.DataType,
                                       IsRequired = f.IsRequired,
                                       DisplayOrder = f.DisplayOrder,
                                       CreatedBy = f.CreatedBy,
                                       CreatedDate = f.CreatedDate,
                                       ModifiedBy = f.ModifiedBy,
                                       ModifiedDate = f.ModifiedDate
                                   }).ToList()
                               }).ToList();
            return importers;
        }
        public ImporterDto GetImporterById(int ImporterId)
        {
            SearchFilterModel SearchModel = new SearchFilterModel
            {
                CurrentPage = 1,
                PageSize = 5
            };
            return GetImporters(SearchModel, ImporterId).FirstOrDefault();
            
        }        
        public ImporterDto GetImporterByName(string ImporterName)
        {
            SearchFilterModel SearchModel = new SearchFilterModel
            {
                CurrentPage = 1,
                PageSize = 5
            };
            return GetImporters(SearchModel, null,ImporterName).FirstOrDefault();
            
        }
        //public List<ImporterTemplateDto> GetImporters(SearchFilterModel SearchModel,int? TemplateId=null)
        //{

        //    var query = from template in Context.ImporterTemplates.AsNoTracking()
        //                //join field in Context.ImporterTemplateFields on template.TemplateId equals field.TemplateId into jT2
        //                //from field in jT2.DefaultIfEmpty()
        //                where (!TemplateId.HasValue || template.TemplateId == TemplateId)
        //                select new ImporterTemplateDto
        //                {
        //                    TemplateId = template.TemplateId,
        //                    TemplateName = template.TemplateName,
        //                    TemplateType = template.TemplateType,
        //                    DestinationTable = template.DestinationTable,

        //                    CreatedBy = template.CreatedBy,
        //                    CreatedDate = template.CreatedDate,
        //                    ModifiedBy = template.ModifiedBy,
        //                    ModifiedDate = template.ModifiedDate,
        //                    Fields = template.Fields
        //                };

        //    int totalCount = query.Count();
        //    if (SearchModel.CurrentPage > 0 && SearchModel.PageSize > 0)
        //    {
        //        int skip = (SearchModel.CurrentPage - 1) * SearchModel.PageSize;
        //        query = query.Skip(skip).Take(SearchModel.PageSize);
        //    }

        //    var results = query.ToList();
        //    throw new NotImplementedException();
        //}
        public ActionsResponseModel AddNewImporter(ImporterDto Model)
        {
            try
            {
                if(Context.Importers.Any(t=>t.ImporterName==Model.ImporterName))
                    return new ActionsResponseModel
                    {
                        Message = "importer already exist (change name)"
                    };

                ImporterModel tbl = new ImporterModel();

                tbl.ImporterName = Model.ImporterName;
                tbl.ImporterType = Model.ImporterType;
                tbl.DestinationStoredProcedure = Model.DestinationStoredProcedure;
                tbl.CreatedDate = DateTime.Now;
                tbl.CreatedBy = Model.CreatedBy;

                Context.Importers.Add(tbl);
                Context.SaveChanges();

                foreach (var field in Model.Columns)
                {
                    ImporterColumnModel tblField = new ImporterColumnModel();

                    tblField.ImporterId = tbl.ImporterId;
                    tblField.ColumnName = field.ColumnName;
                    tblField.DataType = field.DataType;
                    tblField.IsRequired = field.IsRequired;
                    tblField.DisplayOrder = field.DisplayOrder;
                    

                    tblField.CreatedDate = DateTime.Now;
                    tblField.CreatedBy = Model.CreatedBy;

                    Context.ImporterColumns.Add(tblField);
                    Context.SaveChanges();
                }
                return new ActionsResponseModel
                {
                    Message = "تم الحفظ  بنجاح"
                };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Message = ex.Message
                };
            }
        }

        public ActionsResponseModel DeleteImporter(int ImporterId)
        {
            try
            {
                var ImporterColumns = Context.ImporterColumns.Where(x => x.ImporterId == ImporterId).ToList();
                Context.ImporterColumns.RemoveRange(ImporterColumns);
                Context.SaveChanges();

                var importer = Context.ImporterColumns.FirstOrDefault(m => m.ImporterId == ImporterId);
                if (importer != null)
                {
                    Context.Remove(importer);
                    Context.SaveChanges();
                    return new ActionsResponseModel { Message = "Importer Deleted Successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "can't find this importer" };
            }
            catch (Exception)
            {
                //ex.InnerException?.Message ?? ex.Message
                return new ActionsResponseModel { IsSuccess = false, Message = "error , try again later"  };
            }
        }

        public ActionsResponseModel EditImporter(int ImporterId, ImporterDto Model)
        {

            try
            {
                if (Context.Importers.Any(t => t.ImporterName == Model.ImporterName&&t.ImporterId!= ImporterId))
                    return new ActionsResponseModel
                    {
                        Message = "Importer name already exist"
                    };

                var entity = Context.Importers.FirstOrDefault(x => x.ImporterId == ImporterId);

                if (entity != null)
                {
                    entity.ImporterName = Model.ImporterName;
                    entity.ImporterType = Model.ImporterType;
                    entity.DestinationStoredProcedure = Model.DestinationStoredProcedure;
                    entity.ModifiedDate = DateTime.Now;
                    entity.ModifiedBy = Model.ModifiedBy;
                    Context.SaveChanges();
                }

                var ImporterColumns = Context.ImporterColumns.Where(x => x.ImporterId == ImporterId).ToList();
                Context.ImporterColumns.RemoveRange(ImporterColumns);
                Context.SaveChanges();
                foreach (var field in Model.Columns)
                {

                    ImporterColumnModel tblField = new ImporterColumnModel();

                    tblField.ImporterId = ImporterId;
                    tblField.ColumnName = field.ColumnName;
                    tblField.DataType = field.DataType;
                    tblField.IsRequired = field.IsRequired;
                    tblField.DisplayOrder = field.DisplayOrder;


                    tblField.CreatedDate = DateTime.Now;
                    tblField.CreatedBy = Model.CreatedBy;

                    Context.ImporterColumns.Add(tblField);
                    Context.SaveChanges();
                }

                return new ActionsResponseModel
                {
                    Message = "تم التعديل  بنجاح"
                };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Message = ex.Message
                };
            }
        }

        public ActionsResponseModel ExportTemplateByImporterName(string ImporterName)
        {
            var Importer = GetImporterByName(ImporterName);


            if (Importer == null)
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    URL = "",
                    Message = "Can't find importer",
                };
            }
            return ExportImporterTemplate(Importer);

        }
        public ActionsResponseModel ExportTemplateByImporterId(int ImporterId)
        {
            var Importer = GetImporterById(ImporterId);


            if (Importer == null)
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    URL = "",
                    Message = "Can't find importer",
                };
            }
            return ExportImporterTemplate(Importer);

        }
        
        public ActionsResponseModel ExportImporterTemplate(ImporterDto Importer)
        {
            string url = string.Empty;
            try
            {

                DataTable dataTable = new DataTable();

                if (Importer != null && Importer.Columns.Any())
                {
                    var Columns = Importer.Columns.GroupBy(column => column.ColumnName).Select(x => x.First()).OrderBy(x => x.DisplayOrder).ToList();
                    foreach (var importerColumn in Columns)
                    {
                        DataColumn column = new DataColumn();
                        column.ColumnName = importerColumn.ColumnName;
                        dataTable.Columns.Add(column);
                    }
                    url = GetExportUrl(dataTable, Importer.ImporterName);
                }


                return new ActionsResponseModel
                {
                    IsSuccess = true,
                    URL = url,
                    Message = "Template Exported successfully"
                };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    URL = "",
                    Message = ex.InnerException?.Message ?? ex.Message,
                };
            }

        }


        public async Task<ActionsResponseModel> ExecuteImporterById(int importerId, FileImportDto model)
        {
            
            // Validate Importer Existence
            var importer = Context.Importers.FirstOrDefault(e => e.ImporterId == importerId);
            if (importer == null)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = "Invalid importerId." };
            }
            return await ExecuteImporter(importer, model);
        }
        public async Task<ActionsResponseModel> ExecuteImporterByName(string importerName, FileImportDto model)
        {

            // Validate Importer Existence
            var importer = Context.Importers.FirstOrDefault(e => e.ImporterName.ToLower()==importerName.ToLower());
            if (importer == null)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = "Invalid importerId." };
            }
            return await ExecuteImporter(importer, model);
        }

        public async Task<ActionsResponseModel> ExecuteImporter(ImporterModel importer, FileImportDto model)
        {
            try
            {
                //// Validate Importer Existence
                //var importerExists = Context.Importers.Any(e => e.TemplateId == importerId);
                //if (!importerExists)
                //{
                //    return new ActionsResponseModel { IsSuccess = false, Message = "Invalid importerId." };
                //}

                // Validate Files
                if (model.ImportFile == null)
                {
                    return new ActionsResponseModel { IsSuccess = false, Message = "No files uploaded." };
                }
                var uploadResponse = await FileService.UploadFileAsync(model.ImportFile, ImportersFolderName, FileType.Importer);

                

                if (uploadResponse.IsUploaded)
                {
                    
                }
                else
                {
                    return new ActionsResponseModel { IsSuccess = false, Message = $"{uploadResponse.FileName} >> {uploadResponse.Message}" };
                }

                // Save changes to the database

                return ImportFileDataByImporterId(importer, uploadResponse.FileName, uploadResponse.FileUrl, uploadResponse.Extention);
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }
        public ActionsResponseModel ImportFileDataByImporterId(ImporterModel importer, string fileName,string filePath,string fileExtention)
        {
            SqlParameter[] param = new SqlParameter[4];
            param[0] = new SqlParameter("@ImporterId", importer.ImporterId);
            param[1] = new SqlParameter("@FileName", fileName);
            param[2] = new SqlParameter("@FilePath", filePath);
            param[3] = new SqlParameter("@FileFormat", fileExtention);

            var result = SQLHelper.ExecuteDataTable(importer.DestinationStoredProcedure, param, ConnectionString);
            //var result = SQLHelper.SQLQuery<ActionsResponseModel>(importer.DestinationStoredProcedure, ConnectionString, param).FirstOrDefault();
            //var result = SQLHelper.SQLQuery<ActionsResponseModel>("[dbo].[SP_ImportFileDataByImporterId]", ConnectionString, param).FirstOrDefault();
            string exportURL=GetExportUrl(result, importer.ImporterName + "Execute");
            return new ActionsResponseModel { IsSuccess = true, Message = $"File Uploade >> check output",URL=exportURL };
        }

        public List<DBStoredProcedureDto> GetDBStoredProcedure(string SchemaName)
        {
            SqlParameter[] Params = new SqlParameter[1];
            Params[0] = new SqlParameter("@SchemaName", SchemaName);

            var result = SQLHelper.SQLQuery<DBStoredProcedureDto>("[dbo].[SP_GetDBStoredProcedure]", ConnectionString, Params);
            
            

            return result;

        }
        public List<DBTableDto> GetDBTables()
        {
            SqlParameter[] Params = new SqlParameter[0];

            var result = SQLHelper.SQLQuery<DBTableColumnsDto>("[dbo].[SP_GetDBTables]", ConnectionString, Params);
            
            var groupedData = result.GroupBy(x =>new { x.TableName, x.DBName, x.SchemaName }).Select(grp=>new DBTableDto
            {
                TableName =grp.Key.TableName,
                SchemaName =grp.Key.SchemaName,
                DBName =grp.Key.DBName,
                Columns = grp.Where(col=>!string.IsNullOrEmpty(col.ColumnName)).Select(col=>new DBColumnDto
                {
                    ColumnName =col.ColumnName,
                    DataType =col.DataType,
                    IsNullable =col.IsNullable,
                }).ToList()
            }).ToList();


            return groupedData;

        }
        private string GetExportUrl(DataTable DT, string Name)
        {

            ExportTemplateBase exportTemplateBase = new ExportTemplateBase
            {
                Name = Name,
                Username = "",
                TemplateName = Name,
                ReportName = Name,
                CustomerName = "",
                ExcelStyle = ExcelExportStyle.reportStyle,
                SheetName = "Data",
            };
            return _exportService.Export(exportTemplateBase, DT);
        }
    }
}
