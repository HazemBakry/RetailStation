using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.GeneralAccounts;
using MasterErp.Entities.Models;
using MasterErp.Entities.Models.Finance;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.GeneralAccounts.GeneralAccountSettings
{
    public interface ITaxCalculationService
    {
        List<TaxCalculationModel> GetTaxCalculationsData(SearchFilterModel Model);
        ActionsResponseModel CreateNewTaxCalculation(TaxCalculationModel Model);
        ActionsResponseModel EditTaxCalculation(int TaxCalculationId, TaxCalculationModel Model);
        ActionsResponseModel DeleteTaxCalculation(int TaxCalculationId);
        ActionsResponseModel ChangeTaxCalculationStatus(int TaxCalculationId, bool IsActive);
    }
}
