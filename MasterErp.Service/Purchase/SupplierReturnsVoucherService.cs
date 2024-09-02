using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.Purchases;
using MasterErp.Entities.DTOs.Inventory;
using MasterErp.Entities.DTOs.Purchases;
using MasterErp.Entities.Models;
using MasterErp.Interface.Common;
using MasterErp.Interface.Purchase;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.Purchase
{
    public class SupplierReturnsVoucherService : ISupplierReturnsVoucherService
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

        public SupplierReturnsVoucherService(DBContext dBContext, ISQLHelper iSQLHelper, IConfiguration _configuration)
        {
            Context = dBContext;
            SQLHelper = iSQLHelper;
            Configuration = _configuration;
        }

        public PagedResponseModel<SupplierReturnsVoucherDTO> GetSupplierReturnsVoucherData(FilterModel model)
        {
            //var data= Context.SupplierReturnsVoucher.ToList();

            int totalCount = Context.SupplierReturnsVouchers.Count();

            int skip = (model.CurrentPage - 1) * model.PageSize;

            //var data = Context.SupplierReturnsVoucher
            //    .OrderByDescending(e => e.InvoiceDate)
            //    .Skip(skip)
            //    .Take(model.PageSize)
            //    .ToList();

            var data = (from returns in Context.SupplierReturnsVouchers
                        join supplier in Context.Suppliers
                        on returns.SupplierId equals supplier.SupplierId into temp
                        from res in temp.DefaultIfEmpty()
                        select new SupplierReturnsVoucherDTO
                        {
                            SupplierReturnsVoucherId = returns.SupplierReturnsVoucherId,
                            InvoiceNumber = returns.InvoiceNumber,
                            InvoiceDate = returns.InvoiceDate,
                            TotalValue = returns.TotalValue,
                            SupplierId = returns.SupplierId,
                            Notes = returns.Notes,
                            IsCancelled = returns.IsCancelled,
                            IsLocked = returns.IsLocked,
                            InsertUser = returns.CreatedBy,
                            InsertDate = returns.CreatedDate,
                            UpdateUser = returns.ModifiedBy,
                            UpdateDate = returns.ModifiedDate,
                            SupplierName = res.NameEN ?? res.NameAR
                        }).OrderByDescending(e => e.InvoiceNumber)
                           .Skip(skip)
                           .Take(model.PageSize)
                           .ToList();

            return new PagedResponseModel<SupplierReturnsVoucherDTO>
            {
                TotalCount = totalCount,
                Results = data,
                CurrentPage = model.CurrentPage,
                PageSize = model.PageSize
            };
        }


        public ActionsResponseModel CreateNewSupplierReturnsVoucher(OrderModel model)
        {
            try
            {
                SupplierReturnsVoucher tbl = new SupplierReturnsVoucher();


                tbl.InvoiceNumber = Context.SupplierReturnsVouchers.Count() > 0 ? Context.SupplierReturnsVouchers.Max(x => x.InvoiceNumber) + 1 : 1;
                tbl.InvoiceDate = model?.OrderDate ?? DateTime.Now;
                tbl.CreatedDate = DateTime.Now;
                tbl.CreatedBy = string.Empty;
                tbl.IsCancelled = false;
                tbl.IsLocked = false;
                tbl.Notes = model.Notes;
                tbl.InvoiceDate = model?.OrderDate ?? DateTime.Now;
                tbl.TotalValue = model?.OrderDate != null ? model.OrderProducts.Sum(x => x.TotalValue) : 0;
                tbl.SupplierId = (int)model?.SupplierId;

                Context.SupplierReturnsVouchers.Add(tbl);
                Context.SaveChanges();

                foreach (var item in model.OrderProducts)
                {
                    var detail = new SupplierReturnsVoucherDetails
                    {
                        Price = item.Price,
                        ItemId = item.ItemId,
                        Notes = model.Notes,
                        Quantity = item.Quantity,
                        TotalValue = item.TotalValue,
                        SupplierReturnsVoucherId = tbl.SupplierReturnsVoucherId,
                        UnitId = item.UnitId,
                    };

                    Context.SupplierReturnsVoucherDetails.Add(detail);
                    Context.SaveChanges();
                }

                return new ActionsResponseModel
                {
                    Id = tbl.InvoiceNumber,
                    Status = 1,
                    Message = "تم حفظ الطلب بنجاح"
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
