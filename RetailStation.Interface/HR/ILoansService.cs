using RetailStation.Entities.Common;
using RetailStation.Entities.DTOs.HR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Interface.HR
{
    public interface ILoansService
    {
        List<EmployeeLoanDto> GetEmployeeLoansData(SearchFilterModel SearchModel);
        List<EmployeeLoanDto> GetLoansByEmployeeId(int EmployeeId, SearchFilterModel SearchModel);
        ActionsResponseModel AddNewEmployeeLoan(int EmployeeId, EmployeeLoanDto model);
        ActionsResponseModel EditEmployeeLoan(int EmployeeId, EmployeeLoanDto model);
        ActionsResponseModel DeleteEmployeeLoan(int LoanId);
        ActionsResponseModel ApproveEmployeeLoan(int LoanId, int EmployeeId, bool ApproveStatus);
        List<SelectorDataModel> GetLoanTypesSelector();
    }
}
