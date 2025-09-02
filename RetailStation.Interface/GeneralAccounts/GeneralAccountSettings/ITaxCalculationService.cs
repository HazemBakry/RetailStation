using RetailStation.Entities.Common;
using RetailStation.Entities.Common.Finance.GeneralAccounts;
using RetailStation.Entities.Models;
using RetailStation.Entities.Models.Finance;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Interface.GeneralAccounts.GeneralAccountSettings
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
