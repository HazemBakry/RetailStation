using MasterErp.Entities.Common;
using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.GeneralAccounts
{
    public interface IPaymentService
    {
        
        DataTable GetPaymentReceipts_Summary(FilterModel model);
        DataTable GetPaymentReceipts_Filters(FilterModel model);
        ActionsResponseModel SavePaymentReceipt(PaymentReceipt Model);
        ActionsResponseModel CancelPaymentReceipt(int ReceiptId);
        DataTable GetReceiveReceipts_Summary(FilterModel model);
        DataTable GetReceiveReceipts_Filters(FilterModel model);
        ActionsResponseModel SaveReceiveReceipt(ReceiveReceipt Model);

    }
}
