using MasterErp.Entities.Models;
using MasterErp.Entities.Models.Global;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace MasterErp.API.Controllers.Finance.Purchase
{
    [Route("api/[controller]")]
    [ApiController]
    public class BranchController : Controller
    {
        private readonly DBContext Context;

        public BranchController(DBContext context)
        {
            Context = context;
        }

        [HttpGet]
        [Route("GetBranchesData")]
        public List<Branch> GetBranchesData()
        {
            var result = Context.Branches.Where(x => x.IsActive).ToList();
            return result;
        }

        [HttpGet]
        [Route("GetReportsBranches")]
        public List<Branch> GetReportsBranches()
        {
            var result = Context.Branches.Where(x => x.IsActive).ToList();
            return result;
        }

        [HttpPost]
        [Route("CreateBranch")]
        public (int StatusCode, string Message) CreateBranch(Branch model)
        {
            Context.Add(new Branch
            {
                NameAR = model.NameAR,
                NameEN = model.NameEN,
                //Address = model.Address,
                //Email = model.Email,
                IsActive = true,
                //Image = model.Image,
                //Lat = model.Lat,
                //Long = model.Long,
                //WorkingTimeAr = model.WorkingTimeAr,
                //WorkingTimeEn = model.WorkingTimeEn,
                //Phone = model.Phone,
                //TaxNumber = model.TaxNumber,
                //TaxPercent = model.TaxPercent
            });

            try
            {
                Context.SaveChanges();
                return (200, "SUCCESS");
            }
            catch (Exception Ex)
            {
                return (100, "Fail - " + Ex.Message);
            }
        }

        [HttpPost]
        [Route("EditBranch")]
        public (int StatusCode, string Message) EditBranch(Branch model)
        {
            try
            {
                Context.Update(model);
                Context.SaveChanges();

                return (200, "SUCCESS");
            }
            catch (Exception Ex)
            {
                return (100, "ERROR - " + Ex.Message);
            }
        }

        [HttpGet]
        [Route("DeleteBranch")]
        public (int StatusCode, string Message) DeleteBranch(int branchId)
        {
            var branch = Context.Branches.FirstOrDefault(m => m.BranchId == branchId);

            if (branch == null)
            {
                return (100, "Branch Not Found");
            }
            else
            {
                Context.Remove(branch);
                Context.SaveChanges();

                return (200, "Branch Removed Successfully");
            }
        }

    }
}
