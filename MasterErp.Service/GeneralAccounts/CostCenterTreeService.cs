using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Enums;
using MasterErp.Entities.Common.Export;
using MasterErp.Entities.Common.Finance.GeneralAccounts;
using MasterErp.Entities.Models;
using MasterErp.Entities.Models.Finance;
using MasterErp.Interface.Common;
using MasterErp.Interface.GeneralAccounts;
using MasterErp.Service.Common;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.GeneralAccounts
{
    public class CostCenterTreeService : ICostCenterTreeService
    {
        private readonly DBContext Context;
        private readonly ISQLHelper SQLHelper;
        private readonly IConfiguration Configuration;
        private readonly IExportService _exportService;
        private string ConnectionString
        {
            get
            {
                return Configuration.GetConnectionString("DBConnection");
            }
        }
        public CostCenterTreeService(DBContext dBContext, ISQLHelper iSQLHelper, IConfiguration _configuration, IExportService exportService)
        {
            Context = dBContext;
            SQLHelper = iSQLHelper;
            Configuration = _configuration;
            _exportService = exportService;
        }

        public List<CostCenterTree> GetCostCenterTreeData(bool IsParent)
        {
            return Context.CostCenterTree.ToList();
        }

        public List<CostCenterTreeModel> GetCostCenterTreeData(string SearchText)
        {

            return Context.CostCenterTree.Select(x =>
                                        new CostCenterTreeModel
                                        {
                                            CostCenterId = x.CostCenterId,
                                            CostCenterNumber = x.CostCenterNumber,
                                            NameEN = x.NameEN,
                                            NameAR = x.NameAR,
                                            ParentId = x.ParentId,
                                            CostLevel = x.CostLevel,
                                            IsActive = x.IsActive,
                                            IsLocked = x.IsLocked,
                                            IsParent = x.IsParent,
                                            IsExpences = x.IsExpences,
                                            IsPost = x.IsPost,
                                            DisplayOrder = x.DisplayOrder,
                                            IsSelected = x.NameEN.Contains(SearchText) || x.NameEN.Contains(SearchText) || x.CostCenterNumber == SearchText

                                        }).ToList();
        }

        public List<CostCenterTreeModel> GetCostCenterTreeHierarchicalData(string SearchText)
        {

            var lst = GetCostCenterTreeData(SearchText);
            var Tree = BuildTree(lst);
            return Tree;

        }

        static List<CostCenterTreeModel> BuildTree(List<CostCenterTreeModel> costCenterList)
        {
            var costCenterById = costCenterList.ToDictionary(costCenter => costCenter.CostCenterId);

            var roots = new List<CostCenterTreeModel>();

            foreach (var costCenter in costCenterList)
            {
                if (costCenter.ParentId == 0 || costCenter.ParentId is null)
                {
                    costCenter.CostLevel = 1;
                    roots.Add(costCenter);
                }

                if (costCenter.ParentId > 0 && costCenterById.TryGetValue(costCenter.ParentId, out var parentCostCenter))
                {
                    costCenter.CostLevel = parentCostCenter.CostLevel + 1;
                    if (costCenter.IsSelected)
                    {
                        UpdateParentSelection(parentCostCenter, costCenterById);
                    }
                    parentCostCenter.Children.Add(costCenter);
                }
            }

            return roots;
        }

        public static void UpdateParentSelection(CostCenterTreeModel costCenter, Dictionary<int?, CostCenterTreeModel> costCenterList)
        {
            costCenter.IsSelected = true;
            if (costCenter.ParentId >= 0 && costCenterList.TryGetValue(costCenter.ParentId, out var parentCostCenter))
            {
                if (!parentCostCenter.IsSelected && parentCostCenter.ParentId < costCenter.ParentId)
                    UpdateParentSelection(parentCostCenter, costCenterList);
            }
        }

        public ActionsResponseModel CreateNewCostCenter(CostCenterTreeModel Model)
        {
            try
            {
                CostCenterTree tbl = new CostCenterTree();
                var parent = Context.CostCenterTree.FirstOrDefault(x => x.CostCenterId == Model.ParentId);

                tbl.CreatedDate = DateTime.Now;
                tbl.CreatedBy = string.Empty;
                tbl.CostCenterNumber = Model.CostCenterNumber;
                tbl.ParentId = Model.ParentId;
                //tbl.CostLevel = Model.CostLevel ?? 1;
                tbl.CostLevel = parent != null ? parent.CostLevel + 1 : 1;

                tbl.NameAR = Model.NameAR;
                tbl.NameEN = Model.NameEN;
                tbl.IsActive = Model.IsActive;
                tbl.IsLocked = Model.IsLocked;
                tbl.IsParent = tbl.CostLevel == 1 ? true : false;
                tbl.IsPost = Model.IsPost;
                tbl.IsExpences = Model.IsExpences;
                tbl.DisplayOrder = Model.DisplayOrder;


                Context.CostCenterTree.Add(tbl);
                Context.SaveChanges();


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

        public ActionsResponseModel UpdateCostCenterTree(int CostCenterId, CostCenterTreeModel Model)
        {
            try
            {
                var entity = Context.CostCenterTree.FirstOrDefault(x => x.CostCenterId == CostCenterId);

                if (entity != null)
                {
                    var parent = Context.CostCenterTree.FirstOrDefault(x => x.CostCenterId == Model.ParentId);


                    entity.ModifiedDate = DateTime.Now;
                    entity.CreatedBy = string.Empty;

                    entity.CostCenterNumber = Model.CostCenterNumber;
                    entity.ParentId = Model.ParentId;
                    entity.CostLevel = parent != null ? parent.CostLevel + 1 : 1;
                    entity.NameAR = Model.NameAR;
                    entity.NameEN = Model.NameEN;
                    entity.IsActive = Model.IsActive;
                    entity.IsLocked = Model.IsLocked;
                    entity.IsParent = entity.CostLevel == 1 ? true : false;
                    entity.IsPost = Model.IsPost;
                    entity.IsExpences = Model.IsExpences;
                    entity.DisplayOrder = Model.DisplayOrder;
                    Context.SaveChanges();
                    return new ActionsResponseModel
                    {
                        Message = "تم الحفظ  بنجاح"
                    };
                }
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Message = "can't find cost center"
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
        public ActionsResponseModel DeleteCostCenterTree(int CostCenterId)
        {
            try
            {
                var entity = Context.CostCenterTree.FirstOrDefault(x => x.CostCenterId == CostCenterId);

                if (entity != null)
                {

                    var childAccounts = Context.CostCenterTree.Where(x => x.ParentId == CostCenterId);

                    if (childAccounts.Any())
                    {
                        foreach (var acc in childAccounts)
                        {
                            acc.ParentId = entity.ParentId;
                            acc.CostLevel = entity.CostLevel;
                            acc.IsParent = entity.IsParent;
                        }
                    }
                    Context.Remove(entity);

                    Context.SaveChanges();
                    return new ActionsResponseModel
                    {
                        Message = "تم الحذف بنجاح"
                    };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "can't find this cost center" };

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
        public ActionsResponseModel ImportCostCenterTreeList(IFormFile File)
        {
            string url = string.Empty;
            try
            {
                if (File != null && File.Length > 0)
                {
                    using (var stream = new MemoryStream())
                    {
                        File.CopyToAsync(stream);
                        ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                        using (var package = new ExcelPackage(stream))
                        {
                            var worksheet = package.Workbook.Worksheets.First();
                            DataTable dt = worksheet.Cells[1, 1, worksheet.Dimension.End.Row, worksheet.Dimension.End.Column].ToDataTable(c =>
                            {
                                c.FirstRowIsColumnNames = true;
                            });

                            SqlParameter[] Params = new SqlParameter[1];

                            Params[0] = new SqlParameter("@CostCenterList", SqlDbType.Structured);
                            Params[0].Value = dt;

                            var result = SQLHelper.ExecuteDataTable("[dbo].[SP_ImportCostCenterTreeList]", Params, ConnectionString);

                            url = GetExportUrl(result, "CostCenterTreeImporter");
                        }
                    }

                    return new ActionsResponseModel
                    {
                        Status = 1,
                        URL = url,
                        Message = "File uploaded successfully"
                    };

                }

                return new ActionsResponseModel
                {
                    Status = 0,
                    URL = "",
                    Message = "Invalid file"
                };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    Status = 0,
                    URL = "",
                    Message = ex.InnerException?.Message ?? ex.Message,
                };
            }
        }

        public ActionsResponseModel ExportCostCenterTreeList(string SearchText)
        {
            string url = string.Empty;
            try
            {


                SqlParameter[] Params = new SqlParameter[0];
                var dtExport = SQLHelper.ExecuteDataTable("[Finance].[SP_ExportCostCenterTreeList]", Params, ConnectionString);

                url = GetExportUrl(dtExport, "Cost center tree");


                return new ActionsResponseModel
                {
                    IsSuccess = true,
                    URL = url,
                    Message = "File Exported successfully"
                };

            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Status = 0,
                    URL = "",
                    Message = "Server error",
                };
            }


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
