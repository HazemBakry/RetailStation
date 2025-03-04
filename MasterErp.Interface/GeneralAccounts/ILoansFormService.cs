using MasterErp.Entities.Common;
using MasterErp.Entities.Models.HR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.GeneralAccounts
{
    public interface ILoansFormService
    {
        List<Loan> GetLoansData();
        ActionsResponseModel AddNewLoans(Loan Model);
        ActionsResponseModel EditLoans(Loan Model);
        ActionsResponseModel DeleteLoans(int LoanId);
    }
}
