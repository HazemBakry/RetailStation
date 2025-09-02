using RetailStation.Entities.Common;
using RetailStation.Entities.Common.Finance.GeneralAccounts;
using RetailStation.Entities.Models.Finance;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Interface.GeneralAccounts.GeneralAccountSettings
{
    public interface IPaymentTermService
    {
        List<PaymentTermModel> GetPaymentTermsData(SearchFilterModel Model);
        List<PaymentTermDetailsModel> GetPaymentTermDetailsById(int PaymentTermId);
        ActionsResponseModel ChangePaymentTermStatus(int PaymentTermId,bool IsActive);
        ActionsResponseModel CreateNewPaymentTerm(PaymentTermModel Model);
        ActionsResponseModel CreateNewPaymentTermDetails(int PaymentTermId, PaymentTermDetailsModel Model);
        ActionsResponseModel EditPaymentTerm(int PaymentTermId, PaymentTermModel Model);
        ActionsResponseModel EditPaymentTermDetails(int PaymentTermDetailsId,PaymentTermDetailsModel Model);
        ActionsResponseModel DeletePaymentTerm(int PaymentTermId);
        ActionsResponseModel DeletePaymentTermDetails(int PaymentTermDetailsId);
    }
}
