using MasterErp.Entities.Models;
using MasterErp.Interface.Common;
using MasterErp.Interface.Shared;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.Shared
{
    public class SharedService:ISharedService
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

        public SharedService(DBContext dBContext, ISQLHelper iSQLHelper, IConfiguration _configuration)
        {
            Context = dBContext;
            SQLHelper = iSQLHelper;
            Configuration = _configuration;
        }


        public List<Customer> GetCustomersData()
        {
            return Context.Customers.ToList();
        }
        public List<ReceiptLedger> GetReceiptLedgersData()
        {
            return Context.ReceiptLedger.ToList();
        }

        public List<AccountTree> GetAccountsList(bool IsParent)
        {
            var result = Context.AccountTrees.Where(x => x.IsParent == IsParent).ToList();

            return result;
        }
        public List<AccountTree> GetAccountsByTypeId(int TypeId)
        {
            var result = Context.AccountTrees.Where(x => x.AccountTypeId == TypeId).ToList();

            return result;
        }

        public List<ReceitLedgerType> GetReceiptLedgerTypesData()
        {
            var result = Context.ReceitLedgerType.ToList();

            return result;
        }
        public List<FinancialPeriod> GetFinancialPeriods()
        {
            var result = Context.FinancialPeriods.ToList();

            return result;
        }

        public List<AccountType> GetAccountTypes()
        {
            var result = Context.AccountTypes.ToList();

            return result;
        }
    }
}
