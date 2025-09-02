using RetailStation.Entities.Common;
using RetailStation.Entities.Models.HR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Interface.GeneralAccounts
{
    public interface ILoansFormService
    {
        List<Loan> GetLoansData();
        ActionsResponseModel AddNewLoans(Loan Model);
        ActionsResponseModel EditLoans(Loan Model);
        ActionsResponseModel DeleteLoans(int LoanId);
    }
}
