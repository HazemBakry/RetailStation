using RetailStation.Entities.Common;
using RetailStation.Entities.Common.Finance.GeneralAccounts;
using RetailStation.Entities.DTOs.GeneralAccounts;
using RetailStation.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Interface.GeneralAccounts
{
    public interface IReceiptLedgerService
    {
        List<ReceiptLedgerModel> GetReceiptLedgersData(SearchFilterModel Model);
        ActionsResponseModel CreateNewReceiptLedger(ReceiptLedgerModel Model);
        ActionsResponseModel EditReceiptLedger(int ReceiptLedgerId, ReceiptLedgerModel Model);
        ActionsResponseModel DeleteReceiptLedger(int ReceiptLedgerId);
    }
}
