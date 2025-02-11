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
        #region Payment Receipt
        DataTable GetPaymentReceiptsSummary(FilterModel model);
        ActionsResponseModel SavePaymentReceipt(PaymentReceipt Model);
        #endregion

        #region Receive Receipt
        DataTable GetReceiveReceiptsSummary(FilterModel model);
        ActionsResponseModel SaveNewReceiveReceipt(ReceiveReceipt Model);
        #endregion
    }
}
