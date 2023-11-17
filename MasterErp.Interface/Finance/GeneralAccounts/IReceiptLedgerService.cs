using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.GeneralAccounts;
using MasterErp.Entities.DTOs.GeneralAccounts;
using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.Finance.GeneralAccounts
{
    public interface IReceiptLedgerService
    {
        PagedResponseDTO<ReceiptLedgerDTO> GetReceiptLedgersData(FilterModel Model);
        ActionsResponseModel CreateNewReceiptLedger(ReceiptLedgerModel Model);
    }
}
