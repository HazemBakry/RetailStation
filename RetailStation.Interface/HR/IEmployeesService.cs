using RetailStation.Entities.Common;
using RetailStation.Entities.DTOs.Auth;
using RetailStation.Entities.DTOs.HR;
using RetailStation.Entities.Models.HR;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Interface.HR
{
    public interface IEmployeeService
    {
        #region EmployeeCreation
        Task<ActionsResponseModel> CreateNewEmployee(EmployeeDto model);
        Task<ActionsResponseModel> EditEmployee(int EmployeeId, EmployeeDto model);
        Task<ActionsResponseModel> SaveEmployeeContractData(int EmployeeId, EmployeeContractDto model);
        Task<ActionsResponseModel> SaveEmployeeContractDetailsData(int EmployeeId, int ContractId, EmployeeContractDetailsDto model);
        Task<ActionsResponseModel> SaveEmployeeVerificationData(int EmployeeId, EmployeeVerificationDto model);
        Task<ActionsResponseModel> SaveEmployeeAttachments(int EmployeeId, EmployeeAttachmentDto model);
        ActionsResponseModel DeleteEmployeeAttachment(int EmployeeId, int AttachmentId);
        Task<ActionsResponseModel> ChangeEmployeeStatus(int EmployeeId, int StatusId);
        ActionsResponseModel UpdateEmployeeLastJoinDate(int EmployeeId, DateTime LastJoinDate, int StatusId);
        ActionsResponseModel EditEmployeesWorkStatus(string UserId, List<int> EmployeeIds);

        #endregion

        #region GetEmployee

        EmployeeDto GetEmployeeBasicInfoById(int EmployeeId);
        EmployeeContractDto GetEmployeeContractInfoById(int EmployeeId);
        EmployeeVerificationDto GetEmployeeVerificationInfoById(int EmployeeId);
        EmployeeAttachmentDto GetEmployeeAttachmentsById(int EmployeeId);
        List<EmployeeBasicInfo> GetEmployeesSummary_Data(SearchFilterModel model);
        List<FilterModel> GetEmployeesSummary_Filters(SearchFilterModel model);
        List<SelectorDataModel> GetEmployeesByVacationTypes(int VacationTypeId);
        ActionsResponseModel ExportEmployeesSummaryData(SearchFilterModel model);
        int? GetEmployeesCodeByNationality(int NationalityId);
        List<StatisticsCardSummary> GetEmployeesSummary();
        List<SelectorDataModel> GetAllEmployeesSelector();
        List<SelectorDataModel> GetActiveEmployeesSelector(int? EmployeeStatusI);
        ContractDetail GetEmployeeContractDetails(int EmployeeId);
        List<EmployeeSalaryDto> GetEmployeesSalaryByBranch(List<int> BranchId, DateTime ExecutionDate);
        DataTable GetHRDashboardStatistics();
        List<ChartSalarySummaryModel> GetDashboardSalaries_Statistics();
        List<Sponsor> GetSponsorData();

        #endregion

        //List<EmployeeRequest> GetEmployeeRequests_Data(SearchFilterModel model);
        //List<IqamaIssuePlace> GetIqamaIssuePlaces();
        //List<PassportIssuePlace> GetPassportIssuePlaces();
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
