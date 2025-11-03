using RetailStation.Entities.Common;
using RetailStation.Entities.Common.Enums;
using RetailStation.Entities.Common.Export;
using RetailStation.Entities.DTOs.Inventory;
using RetailStation.Entities.Models;
using RetailStation.Interface.Common;
using RetailStation.Service.Common;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using RetailStation.Interface.Operation;
using RetailStation.Entities.Models.Operation;
using RetailStation.Entities.DTOs.Operation;
using System.Threading.Tasks;
using RetailStation.Interface.Website;
using OfficeOpenXml.Export.HtmlExport.StyleCollectors.StyleContracts;
using RetailStation.Entities.DTOs.Website;
using ICU4N.Util;
using RetailStation.Entities.DTOs.Purchases;
using iText.Layout.Properties;
using OpenQA.Selenium.BiDi.Modules.Script;
using RetailStation.Entities.Common.Lookups;
using iText.Layout.Borders;
using RetailStation.Entities.Models.Global;

namespace RetailStation.Service.Website
{
    public class OrderService: IOrderService
    {
        private readonly DBContext Context;
        private readonly LookupsDbContext LookupsDbContext;
        private readonly ISQLHelper SQLHelper;
        private readonly IConfiguration Configuration;
        private readonly ISharedFilterService SharedFilterService;
        private readonly string ConnectionString;
        private readonly IExportService ExportService;
        private readonly IFileService _fileService;
        public readonly string ItemsImagesFolder;
        public OrderService(DBContext Context, ISQLHelper SQLHelper,
            IConfiguration Configuration, IExportService ExportService,
            ISharedFilterService sharedFilterService, LookupsDbContext lookupsDbContext, IFileService fileService)
        {
            this.Context = Context;
            this.SQLHelper = SQLHelper;
            this.Configuration = Configuration;
            ConnectionString = Configuration.GetConnectionString("DBConnection");
            this.ExportService = ExportService;
            SharedFilterService = sharedFilterService;
            LookupsDbContext = lookupsDbContext;
            _fileService = fileService;
            ItemsImagesFolder = "ItemsImages";

        }



        public List<WebsiteOrderModel> GetOrders_Data(SearchFilterModel model, int? OrderId = null)
        {
            DataTable FilterList = SharedFilterService.MapFilterModelToDataTable(model.FilterList);

            SqlParameter[] Params = new SqlParameter[]
            {
                new SqlParameter("@OrderId", (object)OrderId ?? DBNull.Value),
                new SqlParameter("@CurrentPage", (object)model.CurrentPage ?? DBNull.Value),
                new SqlParameter("@PageSize", (object)model.PageSize ?? DBNull.Value),
                new SqlParameter("@FilterList", SqlDbType.Structured) { Value = FilterList },
            };
            var result = SQLHelper.SQLQuery<WebsiteOrderModel>("[dbo].[SP_GetOrders_Data]", ConnectionString, Params);
            return result;
        }
        public List<WebsiteOrderItemModel> GetOrder_Items(int OrderId)
        {

            SqlParameter[] Params = new SqlParameter[]
            {
                new SqlParameter("@OrderId",OrderId),
            };
            var result = SQLHelper.SQLQuery<WebsiteOrderItemModel>("[Operation].[SP_GetOrder_Items]", ConnectionString, Params);
            foreach (var item in result.Where(x => !string.IsNullOrEmpty(x.ImageUrl)))
            {
                item.ImageUrl = _fileService.GetFileDownloadUrl(item.ImageUrl);
            }
            return result;
        }

        public List<FilterModel> GetOrders_Filters(SearchFilterModel PagingFilter)
        {
            var FilterListDt = SharedFilterService.MapFilterModelToDataTable(PagingFilter.FilterList);

            SqlParameter[] Params = new SqlParameter[1];


            Params[0] = new SqlParameter("@FilterList", SqlDbType.Structured);
            Params[0].Value = FilterListDt;

            var results = SQLHelper.SQLQuery<FilterItem>("[dbo].[SP_GetOrders_Filters]", ConnectionString, Params);
            return SharedFilterService.GroupedFilterItems(results);
        }

        public WebsiteOrderModel GetOrderDetailsById(int OrderId)
        {
            return GetOrders_Data(new SearchFilterModel { PageSize = 25, CurrentPage = 1 }, OrderId)?.FirstOrDefault();

        }
        public ActionsResponseModel CreateNewOrder(WebsiteOrderModel model)
        {
            int count = Context.Orders.Select(x => x.OrderNumber).ToList().Count;
            try
            {
                int code = Context.Orders.Count() > 0 ? Context.Orders.Max(x => x.OrderNumber) + 1 : 1;
                string serialNumber = DalHelper.GenerateSerialNumber(SerialType.PurchaseOrder, code);
                Order tbl_Order = new Order
                {
                    OrderNumber = code,
                    SerialNumber = serialNumber,
                    WorkflowStatusId = (int)WorkflowStatus.Pending,
                    SubTotal = Math.Round(model.TotalValue, 2),
                    DeliveryValue = model.DeliveryValue,
                    DiscountAmount = model.Discount.GetValueOrDefault(),
                    Tax = Math.Round(model.Tax.GetValueOrDefault(), 2),
                    TotalValue = Math.Round(model.TotalValue, 2),
                    OrderDate = DateTime.Now,
                    NetValue = model.NetValue.GetValueOrDefault(),
                    Notes = model.Notes,
                    MerchantId = model.MerchantId.GetValueOrDefault(),
                    PaymentTypeId = model.PaymentTypeId.GetValueOrDefault(),
                    CreatedBy = model.CreatedBy,
                    CreatedDate = DateTime.Now
                };

                Context.Orders.Add(tbl_Order);
                var result = Context.SaveChanges();

                foreach (WebsiteOrderItemModel row in model.Items)
                {
                    OrderDetail Invoice_Details = new OrderDetail();

                    Invoice_Details.OrderId = tbl_Order.OrderId;
                    Invoice_Details.ItemId = row.MerchantItemId.GetValueOrDefault();
                    Invoice_Details.UnitId = row.UnitId;
                    Invoice_Details.Quantity = row.Quantity;
                    Invoice_Details.Price = row.Price.GetValueOrDefault();
                    Invoice_Details.SubTotal = row.SubTotal;
                    Invoice_Details.Discount = 0;
                    Invoice_Details.DiscountPercent = 0;
                    Invoice_Details.TotalValue = row.TotalValue;
                    Invoice_Details.Notes = "";

                    Context.OrderDetails.Add(Invoice_Details);
                    Context.SaveChanges();
                }

                return new ActionsResponseModel
                {
                    Message = result > 0 ? "Data saved successfully." : "Failed to record the order details.",
                    Id = tbl_Order.OrderId,
                    Number = tbl_Order.OrderNumber.ToString(),
                    IsSuccess = result > 0
                };
            }
            catch (Exception)
            {
                return new ActionsResponseModel
                {
                    Message = "An Error Occured During Saving Order",
                    IsSuccess = false
                };
            }
        }
        public ActionsResponseModel CreateNewOrder(string UserId, CreateOrderModel model)
        {
            using var transaction = Context.Database.BeginTransaction();

            try
            {
                var requestedItemIds = model.Items.Select(x => x.MerchantItemId).ToList();
                var supplierItems = Context.MerchantItems
                    .Where(x => requestedItemIds.Contains(x.MerchantItemId))
                    .AsNoTracking()
                    .ToList();

                var notFoundItems = requestedItemIds.Except(supplierItems.Select(x => x.MerchantItemId));
                if (notFoundItems.Any())
                {
                    return new ActionsResponseModel
                    {
                        Message = "One or more requested items were not found.",
                        IsSuccess = false
                    };
                }

                foreach (var requestedItem in model.Items)
                {
                    var item = supplierItems.FirstOrDefault(x => x.MerchantItemId == requestedItem.MerchantItemId);
                    if (item == null)
                    {
                        continue;
                    }

                    if (item.Quantity < requestedItem.Quantity)
                    {
                        return new ActionsResponseModel
                        {
                            Message = $"Insufficient stock for item: {item.MerchantItemId}. Available: {item.Quantity}, Requested: {requestedItem.Quantity}",
                            IsSuccess = false
                        };
                    }
                }

                // Get the new order number synchronously.
                var newOrderNumber = Context.Orders.Count() > 0 ? Context.Orders.Max(x => x.OrderNumber) + 1 : 1;

                var requestedItemsByMerchant = model.Items.GroupBy(x => x.MerchantId);

                var createdOrderIds = new List<int>();

                foreach (var supplierGroup in requestedItemsByMerchant)
                {
                    var serialNumber = DalHelper.GenerateSerialNumber(SerialType.PurchaseOrder, newOrderNumber);
                    var order = new Order
                    {
                        MerchantId = (int)supplierGroup.Key,
                        OrderNumber = newOrderNumber,
                        SerialNumber = serialNumber,
                        UserId = UserId,
                        WorkflowStatusId = (int)WorkflowStatus.Pending,
                        SubTotal = Math.Round((decimal)supplierGroup.Sum(x => x.SubTotal), 2),
                        DeliveryValue = 0,
                        DiscountAmount = 0,
                        Tax = 0,
                        TotalValue = Math.Round((decimal)supplierGroup.Sum(x => x.TotalValue), 2),
                        OrderDate = DateTime.Now,
                        NetValue = Math.Round(supplierGroup.Sum(x => x.NetValue.GetValueOrDefault()), 2),
                        Notes = model.Notes,
                        PaymentTypeId = model.PaymentTypeId.GetValueOrDefault(),
                        CreatedBy = model.CreatedBy,
                        CreatedDate = DateTime.Now
                    };

                    Context.Orders.Add(order);
                    Context.SaveChanges(); // Synchronous SaveChanges()

                    createdOrderIds.Add(order.OrderId);

                    var orderDetails = new List<OrderDetail>();
                    foreach (var requestedItem in supplierGroup)
                    {
                        var orderDetail = new OrderDetail
                        {
                            OrderId = order.OrderId,
                            ItemId = requestedItem.MerchantItemId,
                            UnitId = requestedItem.UnitId,
                            Quantity = requestedItem.Quantity,
                            Price = requestedItem.Price.GetValueOrDefault(),
                            SubTotal = (decimal)requestedItem.SubTotal,
                            Discount = requestedItem.Discount.GetValueOrDefault(),
                            DiscountPercent = requestedItem.DiscountPercent.GetValueOrDefault(),
                            TotalValue = (decimal)requestedItem.TotalValue,
                            Notes = requestedItem.Notes
                        };
                        orderDetails.Add(orderDetail);
                    }

                    Context.OrderDetails.AddRange(orderDetails);
                    Context.SaveChanges(); // Synchronous SaveChanges()
                    newOrderNumber++;
                }

                transaction.Commit();

                return new ActionsResponseModel
                {
                    Message = "Orders created successfully.",
                    Id = createdOrderIds.FirstOrDefault(),
                    Number = newOrderNumber.ToString(),
                    IsSuccess = true
                };
            }
            catch (Exception ex)
            {
                transaction.Rollback();

                return new ActionsResponseModel
                {
                    Message = "An Error Occurred During Order Creation: " + ex.Message,
                    IsSuccess = false
                };
            }
        }
        public ActionsResponseModel EditOrder(int OrderId, WebsiteOrderModel model)
        {
            try
            {
                var order_tbl = Context.Orders.Where(i => i.OrderId == OrderId).FirstOrDefault();
                if (order_tbl != null)
                {


                    order_tbl.OrderDate = model?.OrderDate ?? DateTime.Now;
                    order_tbl.Notes = model.Notes;
                    order_tbl.MerchantId = model.MerchantId.GetValueOrDefault();
                    order_tbl.DeliveryValue = model.DeliveryValue;
                    order_tbl.DiscountAmount = model.Discount.GetValueOrDefault();
                    order_tbl.Tax = Math.Round(model.Tax.GetValueOrDefault(), 2);
                    order_tbl.PaymentTypeId = model.PaymentTypeId.GetValueOrDefault();
                    order_tbl.TotalValue = model.Items?.Sum(x => x.TotalValue) ?? 0;
                    order_tbl.NetValue = model.Items?.Sum(x => x.TotalValue) ?? 0;


                    order_tbl.ModifiedBy = model.ModifiedBy;
                    order_tbl.ModifiedDate = DateTime.Now;

                    Context.SaveChanges();

                    var OrderDetails = Context.OrderDetails.Where(x => x.OrderId == OrderId).ToList();
                    Context.OrderDetails.RemoveRange(OrderDetails);
                    Context.SaveChanges();

                    foreach(WebsiteOrderItemModel row in model.Items)
                    {
                        OrderDetail Invoice_Details = new OrderDetail();

                        Invoice_Details.OrderId = OrderId;
                        Invoice_Details.ItemId = row.MerchantItemId.GetValueOrDefault();
                        Invoice_Details.UnitId = row.UnitId;
                        Invoice_Details.Quantity = row.Quantity;
                        Invoice_Details.Price = row.Price.GetValueOrDefault();
                        Invoice_Details.SubTotal = row.SubTotal;
                        Invoice_Details.Discount = 0;
                        Invoice_Details.DiscountPercent = 0;
                        Invoice_Details.TotalValue = row.TotalValue;
                        Invoice_Details.Notes = "";

                        Context.OrderDetails.Add(Invoice_Details);
                        Context.SaveChanges();
                    }
                    return new ActionsResponseModel { Message = "Order Updated Successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "can't find this order" };

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

        public ActionsResponseModel CancelOrder(int OrderId)
        {
            var Invoice = Context.Orders.FirstOrDefault(x => x.OrderId == OrderId);
            if (Invoice != null && Invoice.WorkflowStatusId != (int)WorkflowStatus.Cancelled)
            {
                Invoice.WorkflowStatusId = (int)WorkflowStatus.Cancelled;
                Invoice.ModifiedDate = DateTime.Now;

                Context.SaveChanges();
                return new ActionsResponseModel
                {
                    Id = OrderId,
                    IsSuccess = true,
                    Message = "Order Cancelled Successfly ",
                    Number = Invoice.SerialNumber.ToString()
                };
            }
            else
            {
                return new ActionsResponseModel
                {
                    Id = OrderId,
                    IsSuccess = false,
                    Message = "can't cancel this order",
                    Number = Invoice.SerialNumber.ToString()
                };
            }

        }

    }
}
