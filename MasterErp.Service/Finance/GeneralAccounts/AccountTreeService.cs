using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.GeneralAccounts;
using MasterErp.Entities.Models;
using MasterErp.Interface.Common;
using MasterErp.Interface.Finance.GeneralAccounts;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.Finance.GeneralAccounts
{
    public class AccountTreeService : IAccountTreeService
    {
        private readonly DBContext Context;
        private readonly ISQLHelper SQLHelper;
        private readonly IConfiguration Configuration;

        private string ConnectionString
        {
            get
            {
                return Configuration.GetConnectionString("DBConnection");
            }
        }

        public AccountTreeService(DBContext dBContext, ISQLHelper iSQLHelper, IConfiguration _configuration)
        {
            Context = dBContext;
            SQLHelper = iSQLHelper;
            Configuration = _configuration;
        }


        public ActionsResponseModel CreateNewAccount(AccountTreeModel Model)
        {
            try
            {
                AccountTree tbl = new AccountTree();

                tbl.CreateDate = DateTime.Now;
                tbl.CreatedBy = String.Empty;
                tbl.AccountNumber = Model.AccountNumber;
                tbl.ParentAccountId = Model.ParentAccountId;
                tbl.AccountTypeId = Model.AccountTypeId;
                tbl.AccountLevel = Model.AccountLevel ?? 1;
                tbl.AccountNature = String.Empty;
                tbl.IsActive = Model.IsActive;
                tbl.NameAR = Model.NameEN;
                tbl.NameEN = Model.NameEN;
                tbl.IsDisToCostCenter = Model.IsDisToCostCenter;
               

                Context.AccountTrees.Add(tbl);
                Context.SaveChanges();


                return new ActionsResponseModel
                {
                    Status = 1,
                    Message = "تم الحفظ  بنجاح"
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



        public DataTable GetAccountTreeData_Old(string SearchText)
        {
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@SearchText", SearchText);

            var dt = SQLHelper.ExecuteDataTable("[dbo].[SP_GetAccountTreeData]", ConnectionString, param);

            return dt;
        }

        public List<AccountTreeModel> GetAccountTreeData(string SearchText)
        {
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@SearchText", SearchText);

            var lst = SQLHelper.SQLQuery<AccountTreeModel>("[dbo].[SP_GetAccountTreeData_V2]", ConnectionString, param);
            var Tree = BuildTree(lst);
            return Tree;

        }

        static List<AccountTreeModel> BuildTree(List<AccountTreeModel> accList)
        {
            var accsById = accList.ToDictionary(acc => acc.AccountId);
            var roots = new List<AccountTreeModel>();

            foreach (var acc in accList)
            {
                if (acc.AccountLevel == 1)
                {
                    roots.Add(acc);
                }

                if (acc.AccountLevel > 1 && accsById.TryGetValue(acc.ParentAccountId, out var parentAcc))
                {
                    if (acc.IsSelected)
                    {

                        UpdateParentSelection(parentAcc, accsById);
                        //parentAcc.IsSelected = true;


                    }
                    parentAcc.Children.Add(acc);
                }
            }

            return roots;
        }

        public static void UpdateParentSelection(AccountTreeModel acc,Dictionary<int, AccountTreeModel> accounts)
        {
            acc.IsSelected = true;
            if (acc.AccountLevel >= 1 && accounts.TryGetValue(acc.ParentAccountId, out var parentAcc))
            {
                if(!parentAcc.IsSelected&& parentAcc.AccountLevel<acc.AccountLevel)
                    UpdateParentSelection(parentAcc, accounts);
            }

        }

        public List<AccountTree> GetAccountsList(bool IsParent)
        {
            var result = Context.AccountTrees.Where(x => x.IsParent == IsParent).ToList();

            return result;
        }

        public List<AccountTree> GetChildAccountsList()
        {
            var result = Context.AccountTrees.Where(x => x.AccountLevel == 5).ToList();

            return result;
        }
    }
}
