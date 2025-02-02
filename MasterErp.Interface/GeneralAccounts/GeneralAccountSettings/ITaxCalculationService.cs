using MasterErp.Entities.Common;
using MasterErp.Entities.Models;
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
        DataTable GetTaxCalculationData(FilterModel model);
        List<TaxLookup> GetTaxLookups();
        ActionsResponseModel ChangeTaxCalculationStatus(int TaxCalculationId, bool IsActive);
        ActionsResponseModel AddNewTaxCalculation(TaxCalculation Model);
        ActionsResponseModel EditTaxCalculation(TaxCalculation Model);
        ActionsResponseModel DeleteTaxCalculation(int TaxCalculationId);
    }
}
