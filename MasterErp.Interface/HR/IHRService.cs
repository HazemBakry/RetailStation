using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.HR;
using MasterErp.Entities.Models.HR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.HR
{
    public interface IHRService
    {
        #region Sponsers

        List<SponsorModel> GetSponsorsData(SearchFilterModel Model,int? SponsorId=null);
        SponsorModel GetSponsorById(int SponsorId);
        ActionsResponseModel CreateNewSponsor(SponsorModel Model);
        ActionsResponseModel EditSponsor(int SponsorId, SponsorModel Model);
        ActionsResponseModel DeleteSponsor(int SponsorId);

        #endregion

        #region Departments
        List<DepartmentModel> GetDepartmentsData(SearchFilterModel Model,int? DepartmentId=null);
        DepartmentModel GetDepartmentById(int DepartmentId);

        ActionsResponseModel CreateNewDepartment(DepartmentModel Model);
        ActionsResponseModel EditDepartment(int DepartmentId, DepartmentModel Model);
        ActionsResponseModel DeleteDepartment(int DepartmentId);
        #endregion

        #region Jobs

        List<Job> GetJobsData(SearchFilterModel searchModel);
        ActionsResponseModel CreateNewJob(Job Model);
        ActionsResponseModel EditJob(int JobId, Job Model);
        ActionsResponseModel DeleteJob(int JobId);

        #endregion
    }
}
