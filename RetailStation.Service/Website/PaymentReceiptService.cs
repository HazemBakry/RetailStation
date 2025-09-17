using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.Identity.Client;
using RetailStation.Entities.Common;
using RetailStation.Entities.Common.Enums;
using RetailStation.Entities.Common.Finance.Purchases;
using RetailStation.Entities.DTOs.Website;
using RetailStation.Entities.Models;
using RetailStation.Entities.Models.Operation;
using RetailStation.Entities.Models.Website;
using RetailStation.Interface.Common;
using RetailStation.Interface.Website;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace RetailStation.Service.Website
{
    public class PaymentReceiptService : IPaymentReceiptService
    {
        private readonly DBContext Context;
        private readonly ISQLHelper SQLHelper;
        private readonly IConfiguration Configuration;
        private readonly string ConnectionString;
        private readonly ISharedFilterService SharedFilterService;

        public PaymentReceiptService(DBContext DbContext, ISQLHelper SQLHelper, ISharedFilterService sharedFilterService ,IConfiguration _configuration )
        {
            this.Context = DbContext;
            this.SQLHelper = SQLHelper;
            this.Configuration = _configuration;
            this.ConnectionString = Configuration.GetConnectionString("DBConnection");
            SharedFilterService = sharedFilterService;
        }


        //----------------------------------- Payment Receipt ------------------------------------------//

        public List<PaymentReceiptModel> GetPaymentReceipts_Data(SearchFilterModel model, int? PaymentReceiptId = null)
        {
            DataTable filterList = SharedFilterService.MapFilterModelToDataTable(model.FilterList);

            SqlParameter[] parameters =
            {
                new SqlParameter("@PaymentReceiptId", PaymentReceiptId),
                new SqlParameter("@CurrentPage", model.CurrentPage),
                new SqlParameter("@PageSize", model.PageSize),
                new SqlParameter("@FilterList", SqlDbType.Structured)
                {
                    Value = filterList
                }
            };

            var result = SQLHelper.SQLQuery<PaymentReceiptModel>("[Supplier].[SP_GetPaymentReceipts_Data]", ConnectionString, parameters);
            return result;
        }

        public PaymentReceiptModel GetPaymentReceiptDetailsById(int paymentReceiptId)
        {
            return GetPaymentReceipts_Data(new SearchFilterModel { PageSize = 25, CurrentPage = 1 }, paymentReceiptId)?.FirstOrDefault();
        }

        public List<FilterModel> GetPaymentReceipts_Filters(SearchFilterModel model)
        {
            return new List<FilterModel>();
        }

        public ActionsResponseModel SaveNewPaymentReceipt(PaymentReceiptModel model)
        {
            try
            {


                PaymentReceipt receipt = new PaymentReceipt()
                {
                    ReceiptNumber = Context.PaymentReceipts.Any() ? Context.PaymentReceipts.Max(x => x.ReceiptNumber) + 1 : 1,
                    PaymentTypeId = model.PaymentTypeId,
                    ReleaseDate = model.ReleaseDate ?? DateTime.Now,
                    ContactName = model.ContactName,
                    CurrencyId = model.CurrencyId,
                    FromAccountId = model.FromAccountId,
                    ToAccountId = model.ToAccountId,
                    Description = model.Description,
                    MoneyAmount = model.MoneyAmount,
                    DocNumber = model.DocNumber,
                    SupplierId = model.SupplierId,
                    CreatedDate = DateTime.Now,
                    WorkflowStatusId = (int)WorkflowStatus.Pending,
                    CreatedBy = ""
                };

                Context.PaymentReceipts.Add(receipt);
                var result = Context.SaveChanges();


                return new ActionsResponseModel
                {
                    Message = result > 0 ? "Data saved successfully." : "Failed to record the accounting entry.",
                    Id = receipt.PaymentReceiptId,
                    Number = receipt.ReceiptNumber.ToString(),
                    IsSuccess = result > 0
                };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    Message = ex.Message,
                    IsSuccess = false
                };
            }
        }

        public ActionsResponseModel EditPaymentReceipt(int paymentReceiptId, PaymentReceiptModel model)
        {
            try
            {
               

                PaymentReceipt receipt = Context.PaymentReceipts.FirstOrDefault(x => x.PaymentReceiptId == paymentReceiptId &&
                                                                                     x.WorkflowStatusId != (int)WorkflowStatus.Cancelled &&
                                                                                     x.WorkflowStatusId != (int)WorkflowStatus.Completed);
                if (receipt != null)
                {
                    receipt.PaymentTypeId = model.PaymentTypeId;
                    receipt.ContactName = model.ContactName;
                    receipt.CurrencyId = model.CurrencyId;
                    receipt.ToAccountId = model.ToAccountId;
                    receipt.FromAccountId = model.FromAccountId;
                    receipt.Description = model.Description;
                    receipt.MoneyAmount = model.MoneyAmount;
                    receipt.DocNumber = model.DocNumber;
                    receipt.SupplierId = model.SupplierId;

                    var result = Context.SaveChanges();

                    return new ActionsResponseModel
                    {
                        Message = result >= 0 ? "Data saved successfully." : "Failed to record the accounting entry.",
                        Id = receipt.PaymentReceiptId,
                        Number = receipt.ReceiptNumber.ToString(),
                        IsSuccess = result >= 0
                    };
                }
                else
                {
                    return new ActionsResponseModel { IsSuccess = false, Message = "Could not find this payment order." };
                }
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    Message = ex.Message,
                    IsSuccess = false
                };
            }
        }

        public ActionsResponseModel CancelPaymentReceipt(int receiptId)
        {
            var receipt = Context.PaymentReceipts.FirstOrDefault(x => x.PaymentReceiptId == receiptId);
            if (receipt != null)
            {
                receipt.WorkflowStatusId = (int)WorkflowStatus.Cancelled;
                receipt.ModifiedDate = DateTime.Now;

                Context.SaveChanges();
                return new ActionsResponseModel
                {
                    Id = receiptId,
                    IsSuccess = true,
                    Message = "Receipt canceled successfully.",
                    Status = 200,
                    Number = receipt.ReceiptNumber.ToString()
                };
            }
            else
            {
                return new ActionsResponseModel
                {
                    Id = receiptId,
                    IsSuccess = false,
                    Message = "This receipt does not exist."
                };
            }
        }



        public List<SupplierStatementModel> GetSupplierStatementData(int SupplierId, SearchFilterModel model)
        {
            DataTable FilterList = SharedFilterService.MapFilterModelToDataTable(model.FilterList);

            SqlParameter[] Params = new SqlParameter[4];
            Params[0] = new SqlParameter("@SupplierId", SupplierId);
            Params[1] = new SqlParameter("@CurrentPage", model.CurrentPage);
            Params[2] = new SqlParameter("@PageSize", model.PageSize);
            Params[3] = new SqlParameter("@FilterList", SqlDbType.Structured);
            Params[3].Value = FilterList;
            var results = SQLHelper.SQLQuery<SupplierStatementModel>("[dbo].[SP_GetSupplierAccountStatement]", ConnectionString, Params);
            return results;

        }
    }
}
