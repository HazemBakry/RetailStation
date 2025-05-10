using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.Auth;
using MasterErp.Entities.DTOs.HR;
using MasterErp.Entities.Models.HR;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.HR
{
    public interface IEmployeeService
    {
        #region EmployeeCreation
        Task<ActionsResponseModel> CreateNewEmployee(EmployeeDto model);
        Task<ActionsResponseModel> EditEmployee(int EmployeeId, EmployeeDto model);
        Task<ActionsResponseModel> SaveEmployeeContractData(int EmployeeId, EmployeeContractDto model);
        Task<ActionsResponseModel> SaveEmployeeVerificationData(int EmployeeId, EmployeeVerificationDto model);
        Task<ActionsResponseModel> SaveEmployeeAttachments(int EmployeeId, EmployeeAttachmentDto model);
        #endregion

        #region GetEmployee

        EmployeeDto GetEmployeeBasicInfoById(int EmployeeId);
        EmployeeContractDto GetEmployeeContractInfoById(int EmployeeId);
        EmployeeVerificationDto GetEmployeeVerificationInfoById(int EmployeeId);
        EmployeeAttachmentDto GetEmployeeAttachmentsById(int EmployeeId);
        List<EmployeeBasicInfo> GetEmployeesSummary_Data(SearchFilterModel model);
        List<FilterModel> GetEmployeesSummary_Filters(SearchFilterModel model);
        List<StatisticsCardSummary> GetEmployeesSummary();
        List<SelectorDataModel> GetActiveEmployeesSelector();
        ContractDetail GetEmployeeContractDetails(int EmployeeId);
        List<EmployeeSalaryDto> GetEmployeesSalaryByBranch(List<int> BranchId, DateTime ExecutionDate);

        #endregion

        //List<EmployeeRequest> GetEmployeeRequests_Data(SearchFilterModel model);
        //List<IqamaIssuePlace> GetIqamaIssuePlaces();
        //List<PassportIssuePlace> GetPassportIssuePlaces();
        //List<Sponsor> GetSponsorData();
        //List<IqamaJob> GetIqamaJobData();
        //List<Nationality> GetNationalityData();
        //List<Job> GetJobData();
        //List<Branch> GetBranchData();
        //List<Bank> GetBankData();
        //DataTable GetAllEmployeeSalary();
        ////bool EditEmployeeSalary(EmployeeSalary model);
        //bool AddNewEmployee(SaveEmployeeModel model);
    }
}
