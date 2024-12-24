using MasterErp.Entities.Common.Inventory.PurchasesRequests;
using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.Inventory;
using MasterErp.Entities.Models;
using MasterErp.Interface.Common;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MasterErp.Entities.Common.Finance.GeneralAccounts;
using MasterErp.Entities.DTOs.GeneralAccounts;
using Microsoft.EntityFrameworkCore;
using MasterErp.Entities.Common.Enums;
using MasterErp.Interface.GeneralAccounts;

namespace MasterErp.Service.GeneralAccounts
{
    public class ReceiptLedgerService : IReceiptLedgerService
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

        public ReceiptLedgerService(DBContext dBContext, ISQLHelper iSQLHelper, IConfiguration _configuration)
        {
            Context = dBContext;
            SQLHelper = iSQLHelper;
            Configuration = _configuration;
        }

        public PagedResponseModel<ReceiptLedgerDTO> GetReceiptLedgersData(FilterModel Model)
        {
            int totalCount = Context.ReceiptLedger.Count();

            int skip = (Model.CurrentPage - 1) * Model.PageSize;

            //var data = Context.ReceiptLedger
            //    .OrderByDescending(e => e.InsertDate)
            //    .Skip(skip)
            //    .Take(model.PageSize)
            //.ToList();

            var data = (from entity1 in Context.ReceiptLedger
                        join entity2 in Context.ReceitLedgerType
                        on entity1.ReceiptLedgerTypeId equals entity2.ReceiptLedgerTypeId into join1
                        from res in join1.DefaultIfEmpty()
                        join entity3 in Context.FinancialPeriods on entity1.PeriodId equals entity3.FinancialPeriodId into join2
                        from res1 in join2.DefaultIfEmpty()
                        select new ReceiptLedgerDTO
                        {
                            ReceiptLedgerId = entity1.ReceiptLedgerId,
                            StartReceiptNumber = entity1.StartReceiptNumber,
                            PeriodId = entity1.PeriodId,
                            PeriodName = res1.NameAR ?? res1.NameEN,
                            ReceiptLedgerTypeId = entity1.ReceiptLedgerTypeId,
                            ReceiptLedgerType = res.NameAR ?? res.NameEN,
                            OperationTypeId = entity1.OperationTypeId,
                            OperationType = ((PaymentOperationType)entity1.OperationTypeId).ToString(),
                            Notes = entity1.Notes,
                            Code = entity1.Code,
                            IsActive = entity1.IsActive,
                            IsLocked = entity1.IsLocked,
                            NameAR = entity1.NameAR,
                            NameEN = entity1.NameEN,
                            InsertDate = entity1.InsertDate,
                            UpdateUser = entity1.UpdateUser,
                            UpdateDate = entity1.UpdateDate,
                        }).OrderByDescending(e => e.InsertDate)
                            .Skip(skip)
                            .Take(Model.PageSize)
                            .ToList();
            return new PagedResponseModel<ReceiptLedgerDTO>
            {
                TotalCount = totalCount,
                Results = data,
                CurrentPage = Model.CurrentPage,
                PageSize = Model.PageSize
            };
        }

        public ActionsResponseModel CreateNewReceiptLedger(ReceiptLedgerModel Model)
        {
            try
            {
                ReceiptLedger tbl = new ReceiptLedger();

                tbl.InsertDate = DateTime.Now;
                tbl.InsertUser = string.Empty;

                tbl.StartReceiptNumber = Model.StartReceiptNumber;
                tbl.ReceiptLedgerTypeId = Model.ReceiptLedgerTypeId;
                tbl.PeriodId = Model.PeriodId;
                tbl.OperationTypeId = Model.OperationTypeId;
                tbl.Code = Model.Code;
                tbl.IsActive = Model.IsActive;
                tbl.IsLocked = Model.IsLocked;
                tbl.NameAR = Model.NameAR;
                tbl.NameEN = Model.NameEN;
                tbl.Notes = Model.Notes;


                Context.ReceiptLedger.Add(tbl);
                Context.SaveChanges();


                return new ActionsResponseModel
                {
                    Status = 1,
                    Message = "تم الحفظ  بنجاح"
                };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    Status = 0,
                    Message = ex.Message
                };
            }
        }

    }
}
