using MasterErp.Entities.Common.Finance.Purchases;
using MasterErp.Entities.Common;
using MasterErp.Entities.Models;
using MasterErp.Interface.Common;
using MasterErp.Interface.Inventory;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MasterErp.Entities.Common.Inventory.PurchasesRequests;
using Microsoft.EntityFrameworkCore;
using MasterErp.Entities.DTOs.Inventory;

namespace MasterErp.Service.Inventory
{
    public class PurchasesRequestsService: IPurchasesRequestsService
    {

        private readonly DBContext Context;
        private readonly ISQLHelper SQLHelper;
        private readonly IConfiguration Configuration;

        private string ConnectionString
        {
            get
            {
                return Configuration.GetConnectionString("DBConnection");
            }
        }

        public PurchasesRequestsService(DBContext dBContext, ISQLHelper iSQLHelper, IConfiguration _configuration)
        {
            Context = dBContext;
            SQLHelper = iSQLHelper;
            Configuration = _configuration;
        }


        public PagedResponseDTO<PurchasesRequestDTO> GetPurchasesRequestsData(FilterModel model)
        {
            //var data= Context.PurchaseRequest.ToList();

            int totalCount = Context.PurchaseRequest.Count();

            int skip = (model.CurrentPage - 1) * model.PageSize;

            //var data = Context.PurchaseRequest
            //    .OrderByDescending(e => e.RequestDate)
            //    .Skip(skip)
            //    .Take(model.PageSize)
            //.ToList();

            //var data = Context.PurchaseRequest
            //            .Join(
            //                Context.Branches,
            //                req => req.BranchId,
            //                branch => branch.BranchId,
            //                (req, branch) => new PurchasesRequestDTO
            //                {
            //                    PurchaseRequestId = req.PurchaseRequestId,
            //                    RequestNumber = req.RequestNumber,
            //                    RequestDate = req.RequestDate,
            //                    BranchId = req.BranchId,
            //                    Notes = req.Notes,
            //                    IsDelivered = req.IsDelivered,
            //                    InsertUser = req.InsertUser,
            //                    InsertDate = req.InsertDate,
            //                    UpdateUser = req.UpdateUser,
            //                    UpdateDate = req.UpdateDate,
            //                    BranchName=branch.NameEN?? branch.NameAR
            //                })
            //                .OrderByDescending(e => e.RequestDate)
            //                .Skip(skip)
            //                .Take(model.PageSize)
            //                .ToList();

            var data = (from req in Context.PurchaseRequest
                        join branch in Context.Branches
                        on req.BranchId equals branch.BranchId into temp
                        from res in temp.DefaultIfEmpty()
                        select new PurchasesRequestDTO
                        {
                            PurchaseRequestId = req.PurchaseRequestId,
                            RequestNumber = req.RequestNumber,
                            RequestDate = req.RequestDate,
                            BranchId = req.BranchId,
                            Notes = req.Notes,
                            IsDelivered = req.IsDelivered,
                            InsertUser = req.InsertUser,
                            InsertDate = req.InsertDate,
                            UpdateUser = req.UpdateUser,
                            UpdateDate = req.UpdateDate,
                            BranchName= res.NameEN?? res.NameAR
                        }).OrderByDescending(e => e.RequestDate)
                            .Skip(skip)
                            .Take(model.PageSize)
                            .ToList();
            return new PagedResponseDTO<PurchasesRequestDTO>
            {
                TotalCount = totalCount,
                Results = data,
                CurrentPage = model.CurrentPage,
                PageSize = model.PageSize
            };
        }


        public CreateModifyReturnsModel CreateNewPurchasesRequest(PurchaseRequestModel model)
        {
            try
            {
                PurchaseRequest tbl = new PurchaseRequest();

                tbl.RequestNumber = (Context.PurchaseRequest.Count() > 0 ? Context.PurchaseRequest.Max(x => x.RequestNumber) + 1 : 1);
                tbl.InsertDate = DateTime.Now;
                tbl.InsertUser = String.Empty;
                tbl.BranchId = model.BranchId;
                tbl.IsDelivered = false;
                tbl.Notes = model.Notes;
                tbl.RequestDate = model.RequestDate ?? DateTime.Now;
                
                Context.PurchaseRequest.Add(tbl);
                Context.SaveChanges();

                foreach (var item in model.Items)
                {
                    var detail = new PurchaseRequestDetails
                    {
                        
                        ItemId = item.ItemId,
                        Notes = model.Notes,
                        Quantity = item.Quantity,
                        PurchaseRequestId = tbl.PurchaseRequestId,
                        UnitId = item.UnitId,
                    };

                    Context.PurchaseRequestDetails.Add(detail);
                    Context.SaveChanges();
                }

               
                return new CreateModifyReturnsModel
                {
                    Id=tbl.RequestNumber,
                    Status = 1,
                    Message = "تم حفظ طلب المشترايات بنجاح"
                };
            }
            catch (Exception ex)
            {
                return new CreateModifyReturnsModel
                {
                    Status = 0,
                    Message = ex.Message
                };
            }
        }



    }
}
