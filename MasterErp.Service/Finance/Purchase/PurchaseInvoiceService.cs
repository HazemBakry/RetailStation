using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.Purchases;
using MasterErp.Entities.Models;
using MasterErp.Interface.Common;
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

        private string ConnectionString
        {
            get
            {
                return Configuration.GetConnectionString("DBConnection");
            }
        }

        public PurchaseInvoiceService(DBContext dBContext, ISQLHelper iSQLHelper, IConfiguration _configuration)
        {
            Context = dBContext;
            SQLHelper = iSQLHelper;
            Configuration = _configuration;
        }

        #region PurchasesInvoices

        public List<PurchaseInvoice> GetPurchaseInvoiceData()
        {
            return Context.PurchaseInvoices.ToList();
        }

        public CreateModifyReturnsModel SaveNewPurchaseInvoice(PurchaseInvoiceModel model)
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
                order_tbl.SupplierID = model.SupplierId;
                order_tbl.InvoiceTypeID = model.InvoiceTypeID;
                order_tbl.InvoiceNumber = "po_" + (Context.PurchaseInvoices.Count() > 0 ? Context.PurchaseInvoices.Max(x => x.PurchaseInvoiceID) + 1 : 1);

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
                        PurchaseInvoiceID = order_tbl.PurchaseInvoiceID,
                        UnitID = item.UnitId
                    };

                    Context.PurchaseInvoiceDetails.Add(detail);
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

        public bool CancelPurchaseInvoice(int InvoiceId)
        {

            var Invoice = Context.PurchaseInvoices.FirstOrDefault(x => x.PurchaseInvoiceID == InvoiceId);
            if (Invoice is null)
            {
                return false;
            }
            //Context.PurchaseInvoices.Remove(Invoice);
            Invoice.IsCancelled = true;
            Context.SaveChanges();
            return true;
        }


        public List<PurchaseInvoiceModel> GetInvoicesSearchDataOld(int SupplierId, string InvoiceNumber, string InvoiceDate)
        {
            var results = Context.PurchaseInvoices.AsQueryable();
            if (!string.IsNullOrEmpty(InvoiceNumber))
            {
                results = results.Where(s => s.InvoiceNumber.ToLower()== InvoiceNumber.ToLower());
            }
            if (SupplierId>0)
            {
                results = results.Where(s => s.SupplierID == SupplierId);

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

            var details = Context.PurchaseInvoiceDetails.Where(x=>results.Any(x=>x.PurchaseInvoiceID==x.PurchaseInvoiceID)).ToList();


            var   finalRes= (from inv in results
                            select new PurchaseInvoiceModel
                            {
                                PurchaseInvoiceId = inv.PurchaseInvoiceID,
                                InvoiceNumber = inv.InvoiceNumber,
                                SupplierId = inv.SupplierID,
                                Items = details.Where(x=>x.PurchaseInvoiceID==inv.PurchaseInvoiceID).Select(item =>new ItemModel
                                {
                                    ItemId=item.ItemID,
                                    Quantity= item.Quantity,
                                    //Price= item.Price,
                                    TotalValue= item.TotalValue,
                                    UnitId=item.UnitID,

                                }).ToList()

                            }).ToList();


            return finalRes;
        }
        public List<PurchaseInvoiceItemsModel> GetInvoicesSearchData(int SupplierId, string InvoiceNumber, string InvoiceDate,int InvoiceId=0)
        {


            SqlParameter[] param = new SqlParameter[4];
            param[0] = new SqlParameter("@SupplierId", SupplierId);
            param[1] = new SqlParameter("@InvoiceNumber", InvoiceNumber);
            param[2] = new SqlParameter("@InvoiceDate", !string.IsNullOrEmpty(InvoiceDate) ? DateTime.Parse(InvoiceDate):DBNull.Value);
            param[3] = new SqlParameter("@InvoiceId", InvoiceId);

            var lst = SQLHelper.SQLQuery<PurchaseInvoiceItemsModel>("[dbo].[SP_GetInvoicesSearchData]", ConnectionString, param);
            
            var result= lst.GroupBy(x=>x.PurchaseInvoiceId).Select(p => new { Id = p.Key, lstInvoices = p.Select(prt => prt).ToList() }).ToList();
            var finalRes = new List<PurchaseInvoiceItemsModel>();
            foreach (var item in result)
            {
                var obj = item.lstInvoices;
                var invoice = new PurchaseInvoiceItemsModel
                {
                    InvoiceNumber= obj.FirstOrDefault()?.InvoiceNumber,
                    PurchaseInvoiceId = obj.FirstOrDefault()?.PurchaseInvoiceId,
                    InvoiceTypeId = obj.FirstOrDefault().InvoiceTypeId,
                    SupplierId = obj.FirstOrDefault().SupplierId,
                    SupplierNameAR = obj.FirstOrDefault()?.SupplierNameAR,
                    SupplierNameEN= obj.FirstOrDefault()?.SupplierNameEN,
                    InvoiceTotalValue = obj.FirstOrDefault().InvoiceTotalValue,
                    InvoiceDate = obj.FirstOrDefault().InvoiceDate,
                    Items =obj

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


        #endregion



        #region PurchasesOrders

        public List<PurchaseOrder> GetPurchasesOrdersData()
        {
            return Context.PurchaseOrder.ToList();
        }


        public CreateModifyReturnsModel SaveNewPurchaseOrder(PurchaseOrderModel model)
        {
            try
            {
                PurchaseOrder order_tbl = new PurchaseOrder();

                order_tbl.DueDate = DateTime.Now;
                order_tbl.InsertDate = DateTime.Now;


                order_tbl.InsertUser = string.Empty;
                order_tbl.IsCancelled = false;
                order_tbl.IsLocked = false;
                order_tbl.Notes = model.Notes;
                order_tbl.OrderDate = DateTime.Now;
                order_tbl.TotalValue = model.Items != null ? model.Items.Sum(x => x.TotalValue) : 0;
                order_tbl.SupplierID = model.SupplierId;
                order_tbl.OrderNumber = (Context.PurchaseOrder.Count() > 0 ? Context.PurchaseOrder.Max(x => x.PurchaseOrderID) + 1 : 1);

                Context.PurchaseOrder.Add(order_tbl);
                Context.SaveChanges();

                foreach (ItemModel item in model.Items)
                {
                    var detail = new PurchaseOrderDetails
                    {
                        Price = item.Price,
                        ItemID = item.ItemId,
                        Notes = model.Notes,
                        Quantity = item.Quantity,
                        TotalValue = item.TotalValue,
                        PurchaseOrderID = order_tbl.PurchaseOrderID,
                        UnitID = item.UnitId
                    };

                    Context.PurchaseOrderDetails.Add(detail);
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

        public bool CancelPurchaseOrder(int OrderId)
        {

            var Invoice = Context.PurchaseOrder.FirstOrDefault(x => x.PurchaseOrderID == OrderId);
            if (Invoice is null)
            {
                return false;
            }
            //Context.PurchaseInvoices.Remove(Invoice);
            Invoice.IsCancelled = true;
            Context.SaveChanges();
            return true;
        }


        #endregion



        #region PurchasesReturns


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
                order_tbl.InvoiceTypeID = model.InvoiceTypeId??0;
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

            var Invoice = Context.PurchaseInvoices.FirstOrDefault(x => x.PurchaseInvoiceID == ReturnsId);
            if (Invoice is null)
            {
                return false;
            }
            //Context.PurchaseInvoices.Remove(Invoice);
            Invoice.IsCancelled = true;
            Context.SaveChanges();
            return true;
        }


        #endregion



        #region SuppliersStatement

        public List<SupplierStatementModel> GetSupplierStatementData(int SupplierId)
        {
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@SupplierId", SupplierId);

            var results = SQLHelper.SQLQuery<SupplierStatementModel>("[dbo].[SP_GetSupplierAccountStatement]", ConnectionString, param);
            return results;

        }
        #endregion




        public List<Supplier> GetSuppliersData()
        {
            return Context.Suppliers.ToList();
        }

        public List<Branch> GetBranchesData()
        {
            return Context.Branches.ToList();
        }
        public List<PurchaseInvoiceType> GetInvoiceTypesData()
        {
            return Context.PurchaseInvoiceType.ToList();
        }

        public List<ItemLookups> GetItemLookupsData()
        {
            return Context.ItemLookups.ToList();
        }

        public List<ItemModel> GetItemsData()
        {
            var results = (from item in Context.Items
                           join unit in Context.Units on item.UnitID equals unit.UnitId
                           select new ItemModel
                           {
                               ItemId = item.ItemID,
                               NameEN = item.NameEN,
                               NameAR = item.NameAR,
                               Cost = item.Cost,
                               UnitId = item.UnitID,
                               UnitName = unit.UnitNameEn
                           }).ToList();

            return results;
        }

        public List<ItemModel> GetItemsBySupplierId(int SupplierId)
        {
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@SupplierId", SupplierId);

            var result = SQLHelper.SQLQuery<ItemModel>("[dbo].[SP_GetItemsBySupplierId]", ConnectionString, param);
            return result;
        }

        public List<ItemModel> GetItemsByLookupId(int LookupId)
        {
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@LookupId", LookupId);

            var result = SQLHelper.SQLQuery<ItemModel>("[dbo].[SP_GetItemsByLookupId]", ConnectionString, param);
            return result;
        }



    }
}
