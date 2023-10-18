using MasterErp.Entities.Common;
using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.Finance.GeneralAccounts
{
    public interface IPaymentService
    {
         List<PaymentReceipt> GetPaymentReceiptData();
         CreateModifyReturnsModel SaveNewPaymentReceipt(PaymentReceipt Model);
         List<ReceiveReceipt> GetReceiveReceiptData();
        CreateModifyReturnsModel SaveNewReceiveReceipt(ReceiveReceipt Model);

    }
}
