using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.Shared
{
    public interface ISharedService
    {
        List<Customer> GetCustomersData();
        List<ReceiptLedger> GetReceiptLedgersData();
        List<AccountTree> GetAccountsList(bool IsParent);
        List<AccountTree> GetAccountsByTypeId(int TypeId);
        List<ReceitLedgerType> GetReceiptLedgerTypesData();
        List<FinancialPeriod> GetFinancialPeriods();

    }
}
