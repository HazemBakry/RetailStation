using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.Purchases;
using MasterErp.Entities.Models;
using MasterErp.Interface.Common;
using MasterErp.Interface.Finance.GeneralAccounts;
using MasterErp.Interface.Finance.Purchase;
using MasterErp.Service.Common;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.Finance.Purchase
{
    public class PurchaseInvoiceService : IPurchaseInvoiceService
    {
        private readonly DBContext Context;
        private readonly ISQLHelper SQLHelper;
        private readonly IConfiguration Configuration;
        private readonly IJournalEntryService JournalEntryService;

        private string ConnectionString
        {
            get
            {
                return Configuration.GetConnectionString("DBConnection");
            }
        }

        public PurchaseInvoiceService(DBContext dBContext, ISQLHelper iSQLHelper, IConfiguration _configuration, IJournalEntryService _journalEntryService)
        {
            Context = dBContext;
            SQLHelper = iSQLHelper;
            Configuration = _configuration;
            JournalEntryService = _journalEntryService;
        }

        public DataTable GetPurchaseInvoiceData(FilterModel model)
        {
            SqlParameter[] param = new SqlParameter[2];

            param[0] = new SqlParameter("@CurrentPage", (object)model.CurrentPage ?? DBNull.Value);
            param[1] = new SqlParameter("@PageSize", (object)model.PageSize ?? DBNull.Value);

            var result = SQLHelper.ExecuteDataTable("[dbo].[SP_GetPurchaseInvoiceData]", ConnectionString, param);
            return result;
        }

        public CreateModifyReturnsModel CreateNewPurchaseInvoice(PurchaseInvoiceModel model)
        {
            try
            {
                PurchaseInvoice order_tbl = new PurchaseInvoice();

                order_tbl.DueDate = DateTime.Now;
                order_tbl.InsertDate = DateTime.Now;
                order_tbl.InsertUser = model.UserId;
                order_tbl.IsCancelled = false;
                order_tbl.IsLocked = false;
                order_tbl.Notes = model.Notes;
                order_tbl.InvoiceDate = DateTime.Now;
                order_tbl.InvoiceTotalValue = model.Items != null ? model.Items.Sum(x => x.TotalValue) : 0;
                order_tbl.SupplierId = model.SupplierId;
                order_tbl.InvoiceTypeId = model.InvoiceTypeId;
                order_tbl.InvoiceNumber = (Context.PurchaseInvoices.Count() > 0 ? Context.PurchaseInvoices.Max(x => x.PurchaseInvoiceId) + 1 : 1);

                Context.PurchaseInvoices.Add(order_tbl);
                Context.SaveChanges();

                foreach (ItemModel item in model.Items)
                {
                    var detail = new PurchaseInvoiceDetails
                    {
                        Price = item.Price,
                        ItemID = item.ItemId,
                        Notes = model.Notes,
                        Quantity = item.Quantity,
                        TotalValue = item.TotalValue,
                        PurchaseInvoiceID = order_tbl.PurchaseInvoiceId,
                        UnitID = item.UnitId
                    };

                    Context.PurchaseInvoiceDetails.Add(detail);
                    Context.SaveChanges();
                }

                CreateModifyReturnsModel result = new CreateModifyReturnsModel();
                var AccountsList = new List<JournalEntryAccount>();
                var InvoiceType = Context.PurchaseInvoiceTypes.Where(x => x.InvoiceTypeId == model.InvoiceTypeId).FirstOrDefault();

                if (InvoiceType != null && InvoiceType.IsBindToGeneralAccounting)
                {
                    CreateJournalEntryModel(order_tbl);
                }
                return new CreateModifyReturnsModel
                {
                    Status = 1,
                    Message = "Purchase Order Created"
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

        private void CreateJournalEntryModel(PurchaseInvoice invoice)
        {
            var supplierName = Context.Suppliers.Where(x => x.SupplierId == invoice.SupplierId).FirstOrDefault()?.NameAR;
            var supplier_account = Context.AccountTrees.Where(x => x.AccountTypeID == 5).FirstOrDefault();
            var invoice_type = Context.PurchaseInvoiceTypes.Where(x => x.InvoiceTypeId == invoice.InvoiceTypeId).FirstOrDefault();

            List<JournalEntryAccount> accounts = new List<JournalEntryAccount>();

            accounts.Add(new JournalEntryAccount
            {
                AccountID = supplier_account.AccountID,
                Debit = 0,
                Credit = invoice.InvoiceNetValue,
                Description = " فواتير شهر " + invoice.InvoiceDate.Date.Month + " فاتورة مشتريات رقم " + invoice.InvoiceNumber.ToString() + (supplierName ?? " للمورد " + supplierName),
                CurrencyID = 1
            });
            accounts.Add(new JournalEntryAccount
            {
                AccountID = (int)invoice_type.DebitId,
                Debit = invoice.InvoiceNetValue,
                Credit = 0,
                CurrencyID = 1,
                Description = "فاتورة مشتريات رقم  " + invoice.InvoiceNumber.ToString() + (supplierName ?? " للمورد " + supplierName)

            });

            if (invoice.TaxAmount > 0)
            {
                var tax_account = Context.AccountTrees.Where(x => x.AccountTypeID == 7).FirstOrDefault();

                accounts.Add(new JournalEntryAccount
                {
                    AccountID = tax_account.AccountID,
                    Debit = invoice.TaxAmount,
                    Credit = 0,
                    CurrencyID = 1,
                    Description = " فاتورة مشتريات رقم  " + invoice.InvoiceNumber.ToString() + (supplierName ?? " للمورد " + supplierName)
                });
            }

            JournalEntryModel entry = new JournalEntryModel
            {
                Descirption = " فواتير شهر " + invoice.InvoiceDate.Month + " فاتورة مشتريات رقم " + invoice.PurchaseInvoiceId.ToString() + (supplierName ?? " للمورد " + supplierName),
                DocNumber = invoice.PurchaseInvoiceId.ToString(),
                EntryDate = invoice.InvoiceDate,
                Month = invoice.InvoiceDate.Month,
                Year = invoice.InvoiceDate.Year,
                Notes = invoice.Notes,
                JournalTypeID = 1,   // "قيد تسوية" 
                JournalEntryAccounts = accounts
            };

            JournalEntryService.SaveNewJouranlEntry(entry);
        }

        public bool CancelPurchaseInvoice(int InvoiceId)
        {

            var Invoice = Context.PurchaseInvoices.FirstOrDefault(x => x.PurchaseInvoiceId == InvoiceId);
            if (Invoice is null)
            {
                return false;
            }
            //Context.PurchaseInvoices.Remove(Invoice);
            Invoice.IsCancelled = true;
            Context.SaveChanges();
            return true;
        }

        public List<PurchaseInvoiceModel> GetInvoicesSearchDataOld(int SupplierId, int InvoiceNumber, string InvoiceDate)
        {
            var results = Context.PurchaseInvoices.AsQueryable();
            if (InvoiceNumber > 0)
            {
                results = results.Where(s => s.InvoiceNumber == InvoiceNumber);
            }
            if (SupplierId > 0)
            {
                results = results.Where(s => s.SupplierId == SupplierId);

            }
            if (!string.IsNullOrEmpty(InvoiceDate))
            {

                var parsedDate = DateTime.Parse(InvoiceDate);
                results = results.Where(s => s.InsertDate.Value.Date == parsedDate.Date);

            }

            //var query =
            //           (from inv in results  
            //           join det in Context.PurchaseInvoiceDetails.AsQueryable()
            //           on inv.PurchaseInvoiceID equals det.PurchaseInvoiceID
            //            select new { inv,det}).GroupBy(x => x.inv.PurchaseInvoiceID)

            var details = Context.PurchaseInvoiceDetails.Where(x => results.Any(x => x.PurchaseInvoiceId == x.PurchaseInvoiceId)).ToList();


            var finalRes = (from inv in results
                            select new PurchaseInvoiceModel
                            {
                                PurchaseInvoiceId = inv.PurchaseInvoiceId,
                                //InvoiceNumber = inv.InvoiceNumber,
                                SupplierId = inv.SupplierId,
                                Items = details.Where(x => x.PurchaseInvoiceID == inv.PurchaseInvoiceId).Select(item => new ItemModel
                                {
                                    ItemId = item.ItemID,
                                    Quantity = item.Quantity,
                                    //Price= item.Price,
                                    TotalValue = item.TotalValue,
                                    UnitId = item.UnitID,

                                }).ToList()

                            }).ToList();


            return finalRes;
        }

        public List<PurchaseInvoiceItemsModel> GetInvoicesSearchData(int SupplierId, string InvoiceNumber, string InvoiceDate, int InvoiceId = 0)
        {
            SqlParameter[] param = new SqlParameter[4];
            param[0] = new SqlParameter("@SupplierId", SupplierId);
            param[1] = new SqlParameter("@InvoiceNumber", InvoiceNumber);
            param[2] = new SqlParameter("@InvoiceDate", !string.IsNullOrEmpty(InvoiceDate) ? DateTime.Parse(InvoiceDate) : DBNull.Value);
            param[3] = new SqlParameter("@InvoiceId", InvoiceId);

            var lst = SQLHelper.SQLQuery<PurchaseInvoiceItemsModel>("[dbo].[SP_GetInvoicesSearchData]", ConnectionString, param);

            var result = lst.GroupBy(x => x.PurchaseInvoiceId).Select(p => new { Id = p.Key, lstInvoices = p.Select(prt => prt).ToList() }).ToList();
            var finalRes = new List<PurchaseInvoiceItemsModel>();
            foreach (var item in result)
            {
                var obj = item.lstInvoices;
                var invoice = new PurchaseInvoiceItemsModel
                {
                    InvoiceNumber = obj.FirstOrDefault()?.InvoiceNumber,
                    PurchaseInvoiceId = obj.FirstOrDefault()?.PurchaseInvoiceId,
                    InvoiceTypeId = obj.FirstOrDefault().InvoiceTypeId,
                    SupplierId = obj.FirstOrDefault().SupplierId,
                    SupplierNameAR = obj.FirstOrDefault()?.SupplierNameAR,
                    SupplierNameEN = obj.FirstOrDefault()?.SupplierNameEN,
                    InvoiceTotalValue = obj.FirstOrDefault().InvoiceTotalValue,
                    InvoiceDate = obj.FirstOrDefault().InvoiceDate,
                    Items = obj

                };
                finalRes.Add(invoice);
            }


            return finalRes;
        }

        public PurchaseInvoiceItemsModel GetInvoiceDetailsById(int InvoiceId)
        {
            var result = GetInvoicesSearchData(0, null, null, InvoiceId);

            return result.FirstOrDefault();
        }

        public List<PurchaseReturns> GetPurchasesReturnsData()
        {
            return Context.PurchaseReturns.ToList();
        }

        public CreateModifyReturnsModel SaveNewPurchaseReturns(PurchaseReturnsModel model)
        {
            try
            {
                PurchaseReturns order_tbl = new PurchaseReturns();

                order_tbl.InsertDate = DateTime.Now;
                order_tbl.ReturnsDate = DateTime.Now;
                order_tbl.InsertUser = string.Empty;

                order_tbl.InvoiceNumber = model.InvoiceNumber;
                order_tbl.InvoiceTypeID = model.InvoiceTypeId ?? 0;
                order_tbl.Notes = model.Notes;
                order_tbl.InvoiceDate = DateTime.Now;
                order_tbl.ReturnsInvoiceTotal = model.Items != null ? model.Items.Sum(x => x.TotalValue) : 0;
                order_tbl.SupplierID = model.SupplierId;
                //order_tbl.InvoiceNumber = "po_" + (Context.PurchaseReturns.Count() > 0 ? Context.PurchaseReturns.Max(x => x.PurchaseReturnsID) + 1 : 1);

                Context.PurchaseReturns.Add(order_tbl);
                Context.SaveChanges();

                foreach (PurchaseReturnsDetails item in model.Items)
                {
                    var detail = new PurchaseReturnsDetails
                    {
                        Price = item.Price,
                        ItemID = item.ItemID,
                        Notes = item.Notes,
                        Quantity = item.Quantity,
                        TotalValue = item.TotalValue,
                        PurchaseReturnsID = order_tbl.PurchaseReturnsID,
                        UnitID = item.UnitID
                    };

                    Context.PurchaseReturnsDetails.Add(detail);
                    Context.SaveChanges();
                }

                return new CreateModifyReturnsModel
                {
                    Status = 1,
                    Message = "Purchase Order Created"
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

        public bool CancelPurchaseReturns(int ReturnsId)
        {

            var Invoice = Context.PurchaseInvoices.FirstOrDefault(x => x.PurchaseInvoiceId == ReturnsId);
            if (Invoice is null)
            {
                return false;
            }
            //Context.PurchaseInvoices.Remove(Invoice);
            Invoice.IsCancelled = true;
            Context.SaveChanges();
            return true;
        }

        public List<SupplierStatementModel> GetSupplierStatementData(int SupplierId)
        {
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@SupplierId", SupplierId);

            var results = SQLHelper.SQLQuery<SupplierStatementModel>("[dbo].[SP_GetSupplierAccountStatement]", ConnectionString, param);
            return results;

        }

        public List<PurchaseInvoiceType> GetInvoiceTypesData()
        {
            return Context.PurchaseInvoiceTypes.ToList();
        }

    }
}
