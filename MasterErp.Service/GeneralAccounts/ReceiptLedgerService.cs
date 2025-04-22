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
using Microsoft.Data.SqlClient;
using MasterErp.Entities.DTOs.HR;
using static System.Runtime.InteropServices.JavaScript.JSType;
using MasterErp.Entities.Models.Finance;

namespace MasterErp.Service.GeneralAccounts
{
    public class ReceiptLedgerService : IReceiptLedgerService
    {

        private readonly DBContext Context;
        private readonly LookupsDbContext LookupsContext;
        private readonly ISQLHelper SQLHelper;
        private readonly IConfiguration Configuration;

        private string ConnectionString
        {
            get
            {
                return Configuration.GetConnectionString("DBConnection");
            }
        }

        public ReceiptLedgerService(DBContext dBContext, ISQLHelper iSQLHelper, IConfiguration _configuration, LookupsDbContext lookupsContext)
        {
            Context = dBContext;
            SQLHelper = iSQLHelper;
            Configuration = _configuration;
            LookupsContext = lookupsContext;
        }

        public List<ReceiptLedgerModel> GetReceiptLedgersData(SearchFilterModel searchModel)
        {
            var paymentTypes = LookupsContext.PaymentTypes.ToList();
            var ledgerTypes = LookupsContext.LedgerTypes.ToList();

            var query = from receiptLedger in Context.ReceiptLedgers
                            join period in Context.FinancialPeriods on receiptLedger.FinancialPeriodId equals period.FinancialPeriodId
                            select new ReceiptLedgerModel
                            {
                                ReceiptLedgerId = receiptLedger.ReceiptLedgerId,
                                StartReceiptNumber = receiptLedger.StartReceiptNumber,
                                FinancialPeriodId = receiptLedger.FinancialPeriodId,
                                ReceiptLedgerTypeId = receiptLedger.ReceiptLedgerTypeId,
                                PaymentTypeId = receiptLedger.PaymentTypeId,
                                IsActive = receiptLedger.IsActive,
                                IsLocked = receiptLedger.IsLocked,
                                Code = receiptLedger.Code,
                                NameAR = receiptLedger.NameAR,
                                NameEN = receiptLedger.NameEN,
                                Notes = receiptLedger.Notes,
                                CreatedBy = receiptLedger.CreatedBy,
                                CreatedDate = receiptLedger.CreatedDate,
                                ModifiedBy = receiptLedger.ModifiedBy,
                                ModifiedDate = receiptLedger.ModifiedDate,
                                FinancialPeriodNameEN = period.NameEN,
                                FinancialPeriodNameAR = period.NameAR,
                            };

            int totalCount = query.Count();
            if (searchModel.CurrentPage > 0 && searchModel.PageSize > 0)
            {
                int skip = (searchModel.CurrentPage - 1) * searchModel.PageSize;
                query = query.Skip(skip).Take(searchModel.PageSize);
            }

            var pagedResults = query.ToList();
            //pagedResults.ForEach(x => x.TotalCount = totalCount);

            var results = pagedResults.Select(x =>
            {
                var paymentType = paymentTypes.FirstOrDefault(p => p.PaymentTypeId == x.PaymentTypeId);
                var ledgerType = ledgerTypes.FirstOrDefault(l => l.LedgerTypeId == x.ReceiptLedgerTypeId);
                x.TotalCount = totalCount;
                x.PaymentTypeNameEN = paymentType?.NameEN;
                x.PaymentTypeNameAR = paymentType?.NameAR;
                x.ReceiptLedgerTypeNameEN = ledgerType?.NameEN;
                x.ReceiptLedgerTypeNameAR = ledgerType?.NameAR;
                return x;
            }).ToList();

            return results;
        }



        public ActionsResponseModel CreateNewReceiptLedger(ReceiptLedgerModel Model)
        {
            try
            {
                var entity = Context.ReceiptLedgers.FirstOrDefault(i => i.NameEN == Model.NameEN || i.NameAR == Model.NameAR);
                if (entity != null)
                {
                    return new ActionsResponseModel
                    {
                        IsSuccess = false,
                        Message = "هذا الاسم موجود"
                    };
                }


                ReceiptLedger tbl = new ReceiptLedger();

                tbl.CreatedDate = DateTime.Now;
                tbl.CreatedBy = Model.CreatedBy;
                tbl.Code = Model.Code;
                tbl.IsActive = Model.IsActive;
                tbl.IsLocked = Model.IsLocked;
                tbl.NameAR = Model.NameAR;
                tbl.NameEN = Model.NameEN;
                tbl.Notes = Model.Notes;
                tbl.StartReceiptNumber = Model.StartReceiptNumber;
                tbl.ReceiptLedgerTypeId = Model.ReceiptLedgerTypeId;
                tbl.FinancialPeriodId = Model.FinancialPeriodId;
                tbl.PaymentTypeId = Model.PaymentTypeId;
               

                Context.ReceiptLedgers.Add(tbl);
                Context.SaveChanges();


                return new ActionsResponseModel
                {
                    Message = "تم الحفظ  بنجاح"
                };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Message = ex.Message
                };
            }
        }

        public ActionsResponseModel EditReceiptLedger(int ReceiptLedgerId, ReceiptLedgerModel Model)
        {

            try
            {
                var entity = Context.ReceiptLedgers.FirstOrDefault(i => i.ReceiptLedgerId == ReceiptLedgerId);
                if (entity != null)
                {

                    entity.ModifiedDate = DateTime.Now;
                    entity.ModifiedBy = Model.ModifiedBy;
                    entity.Code = Model.Code;
                    entity.IsActive = Model.IsActive;
                    entity.IsLocked = Model.IsLocked;
                    entity.NameAR = Model.NameAR;
                    entity.NameEN = Model.NameEN;
                    entity.Notes = Model.Notes;
                    entity.StartReceiptNumber = Model.StartReceiptNumber;
                    entity.ReceiptLedgerTypeId = Model.ReceiptLedgerTypeId;
                    entity.FinancialPeriodId = Model.FinancialPeriodId;
                    entity.PaymentTypeId = Model.PaymentTypeId;

                    Context.SaveChanges();


                    return new ActionsResponseModel { Message = "Receipt Ledger Updated Successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "Receipt ledger not found" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }


        public ActionsResponseModel DeleteReceiptLedger(int ReceiptLedgerId)
        {

            try
            {
                var entity = Context.ReceiptLedgers.FirstOrDefault(i => i.ReceiptLedgerId == ReceiptLedgerId);
                if (entity != null)
                {
                    Context.Remove(entity);
                    Context.SaveChanges();
                    return new ActionsResponseModel { Message = "Receipt ledger deleted successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "Receipt ledger not found" }; ;
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }


    }
}
