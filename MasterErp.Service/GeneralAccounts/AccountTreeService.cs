using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.GeneralAccounts;
using MasterErp.Entities.Models;
using MasterErp.Interface.Common;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using OfficeOpenXml;
using LicenseContext = OfficeOpenXml.LicenseContext;
using MasterErp.Entities.Common.Enums;
using MasterErp.Entities.Common.Export;
using MasterErp.Interface.GeneralAccounts;
using MasterErp.Entities.Models.Finance;
using MasterErp.Entities.DTOs.Inventory;
using MasterErp.Service.Common;
using MasterErp.Entities.Models.Inventory;

namespace MasterErp.Service.GeneralAccounts
{
    public class AccountTreeService : IAccountTreeService
    {
        private readonly DBContext Context;
        private readonly ISQLHelper SQLHelper;
        private readonly IExportService _exportService;

        public AccountTreeService(DBContext dBContext, ISQLHelper iSQLHelper, IExportService exportService)
        {
            Context = dBContext;
            SQLHelper = iSQLHelper;
            _exportService = exportService;
        }

        public ActionsResponseModel AddNewAccount(AccountTreeModel Model)
        {
            try
            {
                var parentAccount = Context.AccountTrees.FirstOrDefault(x => x.AccountId == Model.ParentAccountId);
                //elassal fix 26/2
                if (parentAccount is not null && !parentAccount.IsParent)
                {
                    parentAccount.IsParent = true;
                }
                AccountTree tbl = new AccountTree();

                //tbl.AccountNumber = Model.AccountNumber;
                tbl.AccountNumber = GenerateAccountNumber(Model.ParentAccountId);
                tbl.ParentAccountId = Model.ParentAccountId;
                tbl.AccountTypeId = Model.AccountTypeId;
                tbl.AccountLevel = parentAccount != null ? parentAccount.AccountLevel + 1 : 1;
                tbl.IsParent = parentAccount != null ? false : true;
                tbl.AccountNature = string.Empty;
                tbl.IsActive = Model.IsActive;
                tbl.IsGroup = Model.IsGroup;
                tbl.NameAR = Model.NameAR;
                tbl.NameEN = Model.NameEN;
                tbl.IsDisToCostCenter = Model.IsDisToCostCenter;
                tbl.CostCenterId = Model.CostCenterId;

                tbl.CreatedDate = DateTime.Now;
                tbl.CreatedBy = Model.CreatedBy;

                Context.AccountTrees.Add(tbl);
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
        public string GenerateAccountNumber(int? parentAccountId)
        {
            string newAccountNumber;

            if (parentAccountId == null)
            {

                var maxParentNumber = Context.AccountTrees
                    .Where(a => a.ParentAccountId == null || a.ParentAccountId == 0)
                    .Max(a => (int?)Convert.ToInt32(a.AccountNumber)) ?? 0;

                newAccountNumber = (maxParentNumber + 1).ToString();
            }
            else
            {

                var parent = Context.AccountTrees.FirstOrDefault(acc => acc.AccountId == parentAccountId);
                if (parent == null) throw new Exception($"Parent account (ID: {parentAccountId}) not found");

                var maxChildNumber = Context.AccountTrees
                    .Where(a => a.ParentAccountId == parentAccountId)
                    .Max(a => (int?)Convert.ToInt32(a.AccountNumber.Substring(parent.AccountNumber.Length))) ?? 0;


                newAccountNumber = $"{parent.AccountNumber}{(maxChildNumber + 1):D2}";
            }

            return newAccountNumber;
        }


        public ActionsResponseModel EditAccountTree(int AccountId, AccountTreeModel Model)
        {
            try
            {
                var entity = Context.AccountTrees.FirstOrDefault(x => x.AccountId == AccountId);

                if (entity != null)
                {
                    var parentAccount = Context.AccountTrees.FirstOrDefault(x => x.AccountId == Model.ParentAccountId);
                    //elassal fix 26/2
                    if (parentAccount is not null && !parentAccount.IsParent)
                    {
                        parentAccount.IsParent = true;
                    }

                    //entity.AccountNumber = Model.AccountNumber;
                    entity.ParentAccountId = Model.ParentAccountId;
                    entity.AccountTypeId = Model.AccountTypeId;
                    entity.AccountLevel = parentAccount != null ? parentAccount.AccountLevel + 1 : 1;
                    entity.IsParent = parentAccount != null ? false : true;
                    entity.AccountNature = string.Empty;
                    entity.IsActive = Model.IsActive;
                    entity.IsGroup = Model.IsGroup;
                    entity.NameAR = Model.NameAR ?? "";
                    entity.NameEN = Model.NameEN ?? "";
                    entity.IsDisToCostCenter = Model.IsDisToCostCenter;
                    entity.CostCenterId = Model.CostCenterId;
                    entity.ModifiedDate = DateTime.Now;
                    entity.ModifiedBy = Model.ModifiedBy;
                }

                Context.SaveChanges();
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
        public ActionsResponseModel DeleteAccountTree(int AccountId)
        {
            try
            {
                var entity = Context.AccountTrees.FirstOrDefault(x => x.AccountId == AccountId);

                if (entity != null)
                {

                    var childAccounts = Context.AccountTrees.Where(x => x.ParentAccountId == AccountId);

                    if (childAccounts.Any())
                    {
                        foreach (var acc in childAccounts)
                        {
                            acc.ParentAccountId = entity.ParentAccountId;
                            acc.AccountLevel = entity.AccountLevel;
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
                    return new ActionsResponseModel { IsSuccess = false, Message = "can't find this account" };

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

        public List<AccountTreeModel> GetAccountTreeData(string SearchText)
        {
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@SearchText", SearchText);

            var lst = SQLHelper.SQLQuery<AccountTreeModel>("[Finance].[SP_GetAccountTreeData]", null, param);
            return lst;
        }

        public List<AccountTreeModel> GetAccountTreeHierarchicalData(string SearchText)
        {
            var lst = GetAccountTreeData(SearchText);
            var Tree = BuildTree(lst);
            return Tree;

        }

        static List<AccountTreeModel> BuildTree(List<AccountTreeModel> accList)
        {
            var accsById = accList.ToDictionary(acc => acc.AccountId);
            var roots = new List<AccountTreeModel>();

            foreach (var acc in accList)
            {
                if (acc.ParentAccountId == 0 || acc.ParentAccountId is null)
                {
                    acc.AccountLevel = 1;
                    roots.Add(acc);
                }

                if (acc.ParentAccountId > 0 && accsById.TryGetValue(acc.ParentAccountId, out var parentAcc))
                {
                    acc.AccountLevel = parentAcc.AccountLevel + 1;
                    if (acc.IsSelected)
                    {
                        acc.IsSearchResult = true;
                        UpdateParentSelection(parentAcc, accsById);
                        //parentAcc.IsSelected = true;
                    }

                    parentAcc.Children.Add(acc);
                }
            }

            return roots;
        }

        public static void UpdateParentSelection(AccountTreeModel acc, Dictionary<int?, AccountTreeModel> accounts)
        {
            acc.IsSelected = true;
            if (acc.ParentAccountId >= 0 && accounts.TryGetValue(acc.ParentAccountId, out var parentAcc))
            {
                if (!parentAcc.IsSelected && parentAcc.ParentAccountId < acc.ParentAccountId)
                    UpdateParentSelection(parentAcc, accounts);
            }
        }

        public List<AccountTree> GetAccountsList(bool IsParent)
        {
            var result = Context.AccountTrees.Where(x => x.IsParent == IsParent).ToList();

            return result;
        }


        public ActionsResponseModel ImportAccountTreeList(IFormFile File)
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

                            Params[0] = new SqlParameter("@AccountList", SqlDbType.Structured);
                            Params[0].Value = dt;

                            var result = SQLHelper.ExecuteDataTable("[dbo].[SP_ImportAccountTreeList]", Params);
                            url = GetExportUrl(result, "AccountTreeImporter");
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


        public ActionsResponseModel ExportAccountTreeList(string SearchText)
        {
            string url = string.Empty;
            try
            {
                SqlParameter[] Params = new SqlParameter[0];
                var dtExport = SQLHelper.ExecuteDataTable("[Finance].[SP_ExportAccountTreeList]", Params);

                url = GetExportUrl(dtExport, "Account tree");

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
            DT.TableName = Name;

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

        #region OpeningBalance

        public ActionsResponseModel UpdateAccountsOpeningBalance(List<AccountTreeModel> AccList)
        {
            try
            {
                foreach (var Model in AccList)
                {
                    var entity = Context.AccountTrees.FirstOrDefault(x => x.AccountId == Model.AccountId);

                    if (entity != null)
                    {
                        entity.PreDebit = Model.PreDebit;
                        entity.PreCredit = Model.PreCredit;
                        entity.ModifiedDate = DateTime.Now;
                        entity.CreatedBy = string.Empty;
                    }
                }

                Context.SaveChanges();

                return new ActionsResponseModel
                {
                    Status = 1,
                    Message = "تم حفظ البيانات بنجاح"
                };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    Status = 0,
                    Message = ex.Message
                };
            }
        }
        public List<AccountTreeModel> GetAccountsOpeningBalanceData(string SearchText)
        {
            var lst = GetAccountTreeData(SearchText);


            foreach (var item in lst.Where(x => x.IsSelected).ToList())
            {
                UpdateChildSelection(item, lst);

            }

            if (!string.IsNullOrEmpty(SearchText))
            {
                lst = lst.Where(x => x.IsSelected).ToList();
            }
            return lst;
        }

        public static void UpdateChildSelection(AccountTreeModel acc, List<AccountTreeModel> accounts)
        {

            var lst = accounts.Where(x => x.ParentAccountId == acc.AccountId).ToList();
            if (lst.Any())
            {
                foreach (var item in lst)
                {
                    item.IsSelected = true;
                    UpdateChildSelection(item, accounts);
                }
            }
        }

        #endregion


    }
}
