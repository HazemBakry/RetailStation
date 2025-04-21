using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.GeneralAccounts;
using MasterErp.Entities.DTOs.GeneralAccounts;
using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.GeneralAccounts
{
    public interface IReceiptLedgerService
    {
        List<ReceiptLedgerModel> GetReceiptLedgersData(SearchFilterModel Model);
        ActionsResponseModel CreateNewReceiptLedger(ReceiptLedgerModel Model);
        ActionsResponseModel EditReceiptLedger(int ReceiptLedgerId, ReceiptLedgerModel Model);
        ActionsResponseModel DeleteReceiptLedger(int ReceiptLedgerId);
    }
}
