using RetailStation.Interfaces.Subscription;
using RetailStation.Interface.Common;
using Microsoft.Extensions.Configuration;
using RetailStation.Entities.Common;
using RetailStation.Entities.DTOs.Subscription;
using RetailStation.Entities.Models;
using System.Threading.Tasks;
using System.Linq;
using RetailStation.Entities.Models.Subscription;
using System;
using System.Data.Entity;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;
using RetailStation.Entities.DTOs.Auth;
using System.IO;
using RetailStation.Entities.Models.Auth;
using RetailStation.Interface.Shared;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System.Linq.Expressions;
using RetailStation.Entities.DTOs.Lookups;
using RetailStation.Entities.Models.Lookups;
using Microsoft.EntityFrameworkCore;
using Microsoft.CodeAnalysis.Operations;
using RetailStation.Entities.Models.Global;
using RetailStation.Interface.Branches;

namespace RetailStation.Service.Branches
{
    public class BranchesService : IBranchesService
    {

        private readonly ISQLHelper _sQLHelper;
        private readonly IConfiguration _configuration;
        private readonly DBContext Context;
        private readonly ISharedFilterService SharedFilterService;
        private readonly string ConnectionString;

        public BranchesService(
            ISQLHelper sQLHelper, IConfiguration configuration,
            ISharedFilterService sharedFilterService, DBContext context)
        {
            _sQLHelper = sQLHelper;
            _configuration = configuration;
            ConnectionString = _configuration.GetConnectionString("DBConnection");
            SharedFilterService = sharedFilterService;
            Context = context;
        }



        public List<BranchDto> GetBranches(string subscriberId, SearchFilterModel model)
        {
            var query = Context.Branches.Where(b => b.SubscriberId == subscriberId);

            if (!string.IsNullOrEmpty(model.SearchText))
            {
                query = query.Where(b => b.NameEN.Contains(model.SearchText) || b.NameAR.Contains(model.SearchText));
            }

            if (model.FilterList.Any(f=>f.CategoryName == "IsActive"))
            {
                bool.TryParse(model.FilterList.FirstOrDefault(f => f.CategoryName == "IsActive")?.ItemFlag, out bool isActive);
                query = query.Where(b => b.IsActive == isActive) ;
            }

            return query
                .OrderBy(b => b.DisplayOrder)
                //.Skip((model.Page - 1) * model.PageSize)
                //.Take(model.PageSize)
                .Select(b => new BranchDto
                {
                    BranchId = b.BranchId,
                    Code = b.Code,
                    NameAR = b.NameAR,
                    NameEN = b.NameEN,
                    IsActive = b.IsActive,
                    IsAdminBranch = b.IsAdminBranch,
                    Phone = b.Phone,
                    Email = b.Email,
                    Address = b.Address
                })
                .ToList();
        }

        public BranchDto GetBranchById(string subscriberId, int branchId)
        {
            var branch = Context.Branches.FirstOrDefault(b => b.SubscriberId == subscriberId && b.BranchId == branchId);

            if (branch == null) return null;

            return new BranchDto
            {
                BranchId = branch.BranchId,
                Code = branch.Code,
                NameAR = branch.NameAR,
                NameEN = branch.NameEN,
                IsActive = branch.IsActive,
                IsAdminBranch = branch.IsAdminBranch,
                Phone = branch.Phone,
                Email = branch.Email,
                Address = branch.Address
            };
        }

        public ActionsResponseModel AddNewBranch(string subscriberId, BranchDto model)
        {
            var branchExists = Context.Branches.Any(b => b.SubscriberId == subscriberId && (b.NameAR == model.NameAR|| b.NameEN == model.NameEN));

            if (branchExists) new ActionsResponseModel { IsSuccess=false,Message = "this branch already exists" };
            var newBranch = new Branch
            {
                SubscriberId = subscriberId,
                Code = model.Code,
                NameAR = model.NameAR,
                NameEN = model.NameEN,
                IsActive = model.IsActive,
                IsAdminBranch = model.IsAdminBranch,
                Phone = model.Phone,
                Email = model.Email,
                Address = model.Address,
                CreatedBy = model.CreatedBy,
                CreatedDate = DateTime.Now
            };

            Context.Branches.Add(newBranch);
            Context.SaveChanges();

            return new ActionsResponseModel { Message = "Branch added successfully." };
        }

        public ActionsResponseModel EditBranch(string subscriberId,int BranchId, BranchDto model)
        {
            var branch = Context.Branches.FirstOrDefault(b => b.SubscriberId == subscriberId && b.BranchId == BranchId);

            if (branch == null) return new ActionsResponseModel { IsSuccess = false, Message = "Branch not found." };

            branch.Code = model.Code;
            branch.NameAR = model.NameAR;
            branch.NameEN = model.NameEN;
            branch.IsActive = model.IsActive;
            branch.IsAdminBranch = model.IsAdminBranch;
            branch.Phone = model.Phone;
            branch.Email = model.Email;
            branch.Address = model.Address;
            branch.ModifiedBy = model.ModifiedBy;
            branch.ModifiedDate = DateTime.Now;

            Context.SaveChanges();

            return new ActionsResponseModel { Message = "Branch updated successfully." };
        }

        public ActionsResponseModel DeleteBranch(string subscriberId, int branchId)
        {
            var branch = Context.Branches.FirstOrDefault(b => b.SubscriberId == subscriberId && b.BranchId == branchId);

            if (branch == null) return new ActionsResponseModel { IsSuccess = false, Message = "Branch not found." };

            Context.Branches.Remove(branch);
            Context.SaveChanges();

            return new ActionsResponseModel { Message = "Branch deleted successfully." };
        }


    }
}
