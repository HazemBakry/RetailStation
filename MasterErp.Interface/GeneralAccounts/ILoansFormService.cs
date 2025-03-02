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
        List<Loans> GetLoansData();
        ActionsResponseModel AddNewLoans(Loans Model);
        ActionsResponseModel EditLoans(Loans Model);
        ActionsResponseModel DeleteLoans(int LoanId);
    }
}
