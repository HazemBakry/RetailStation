using MasterErp.Entities.Common;
using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.GeneralAccounts.GeneralAccountSettings
{
    public interface IPaymentTermService
    {
        List<PaymentTerm> GetPaymentTermsData();
        List<PaymentTermDetail> GetPaymentTermDetailsById(int PaymentTermId);
        ActionsResponseModel ChangePaymentTermStatus(bool IsActive, int PaymentTermId);
        ActionsResponseModel AddNewPaymentTerm(PaymentTerm Model);
        ActionsResponseModel AddNewPaymentTermDetails(PaymentTermDetail Model);
        ActionsResponseModel EditPaymentTerm(PaymentTerm Model);
        ActionsResponseModel EditPaymentTermDetails(PaymentTermDetail Model);
        ActionsResponseModel DeletePaymentTerm(int PaymentTermId);
        ActionsResponseModel DeletePaymentTermDetails(int PaymentTermDetailId);
    }
}
