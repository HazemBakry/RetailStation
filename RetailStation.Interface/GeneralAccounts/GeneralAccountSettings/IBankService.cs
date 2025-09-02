using RetailStation.Entities.Common;
using RetailStation.Entities.Models.Finance;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Interface.GeneralAccounts.GeneralAccountSettings
{
    public interface IBankService
    {
        List<Bank> GetBanksData(SearchFilterModel searchModel);
        ActionsResponseModel CreateNewBank(Bank Model);
        ActionsResponseModel EditBank(int BankId, Bank Model);
        ActionsResponseModel DeleteBank(int BankId);
    }
}
