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
using RetailStation.Entities.Models.SystemAdmin;

namespace RetailStation.Service.Website
{
    public class OrderService : IOrderService
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

        public List<WebsiteOrderModel> GetOrders_Data(SearchFilterModel model, string UserId, int? OrderId = null)
        {
            DataTable FilterList = SharedFilterService.MapFilterModelToDataTable(model.FilterList);

            SqlParameter[] Params = new SqlParameter[]
            {
                new SqlParameter("@OrderId", OrderId ),
                new SqlParameter("@UserId", UserId ),
                new SqlParameter("@CurrentPage", model.CurrentPage ),
                new SqlParameter("@PageSize", model.PageSize ),
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

        public List<FilterModel> GetOrders_Filters(SearchFilterModel PagingFilter, string UserId)
        {
            var FilterListDt = SharedFilterService.MapFilterModelToDataTable(PagingFilter.FilterList);

            SqlParameter[] Params = new SqlParameter[2];

            Params[0] = new SqlParameter("@UserId", UserId );
            Params[1] = new SqlParameter("@FilterList", SqlDbType.Structured);
            Params[1].Value = FilterListDt;

            var results = SQLHelper.SQLQuery<FilterItem>("[dbo].[SP_GetOrders_Filters]", ConnectionString, Params);
            return SharedFilterService.GroupedFilterItems(results);
        }

        public WebsiteOrderModel GetOrderDetailsById(string UserId, int OrderId)
        {
            return GetOrders_Data(new SearchFilterModel { PageSize = 25, CurrentPage = 1 }, UserId, OrderId)?.FirstOrDefault();

        }

        
        public ActionsResponseModel CreateNewOrder(string UserId, CreateOrderModel model)
        {
            using var transaction = Context.Database.BeginTransaction();

            try
            {
                var lastOrder = Context.Orders
                           .OrderByDescending(x => x.OrderNumber)
                           .Select(x => x.OrderNumber)
                           .FirstOrDefault();
                var orderNumber = lastOrder + 1;
                var serialNumber = DalHelper.GenerateSerialNumber(SerialType.PurchaseOrder, orderNumber);
                var now = DateTime.UtcNow;

                Order tbl_ord = new Order
                {
                    OrderNumber = orderNumber,
                    SerialNumber = serialNumber,

                    PaymentTypeId = model.PaymentTypeId.GetValueOrDefault(),
                    UserId = UserId,
                    WorkflowStatusId = (int)WorkflowStatus.Pending,
                    SubTotal = Math.Round((decimal)model.Items.Sum(x => x.SubTotal), 2),
                    //SubTotal = model.SubTotal ?? 0,
                    TotalValue = Math.Round((decimal)model.Items.Sum(x => x.TotalValue), 2),
                    //TotalValue = model.TotalValue,
                    NetValue = Math.Round((decimal)model.Items.Sum(x => x.NetValue.GetValueOrDefault()), 2),
                    //NetValue = model.NetValue ?? 0,
                    DiscountAmount = 0,
                    DeliveryValue = 0,
                    Tax = model.Tax ?? 0,
                    OrderDate = now,
                    Notes = model.Notes,
                    CountryId = model.CountryId,
                    CityId = model.CityId,
                    FullAddress = model.FullAddress,
                    ReceiverName = model.ReceiverName,
                    PhoneNumber = model.PhoneNumber,
                    CountryCode = model.CountryCode,
                    CreatedBy = UserId,
                    CreatedDate = now,
                };
                Context.Orders.Add(tbl_ord);
                Context.SaveChanges();

                var requestedItemIds = model.Items.Select(x => x.MerchantItemId).ToList();
                var merchantItems = Context.MerchantItems
                    .Where(x => requestedItemIds.Contains((int)x.MerchantItemId)&&x.IsActive)
                    .AsNoTracking()
                    .ToList();

                var notFoundItems = requestedItemIds.Except(merchantItems.Select(x => (int)x.MerchantItemId));
                if (notFoundItems.Any())
                {
                    transaction.RollbackAsync();

                    return new ActionsResponseModel
                    {
                        Message = "One or more requested items were not found.",
                        IsSuccess = false
                    };
                }

                foreach (var requestedItem in model.Items)
                {
                    var item = merchantItems.FirstOrDefault(x => x.MerchantItemId == requestedItem.MerchantItemId);
                    if (item == null)
                    {
                        continue;
                    }

                    //if (item.Quantity < requestedItem.Quantity)
                    //{
                    //    transaction.RollbackAsync();
                    //    return new ActionsResponseModel
                    //    {
                    //        Message = $"Insufficient stock for item: {item.MerchantItemId}. Available: {item.Quantity}, Requested: {requestedItem.Quantity}",
                    //        IsSuccess = false
                    //    };
                    //}

                }
                
                var orderDetails = model.Items.Select(requestedItem => new OrderDetail
                {
                    OrderId = tbl_ord.OrderId,
                    MerchantId = requestedItem.MerchantId.GetValueOrDefault(),
                    ItemId = requestedItem.MerchantItemId,
                    UnitId = requestedItem.UnitId,
                    Quantity = requestedItem.Quantity,
                    Price = requestedItem.Price.GetValueOrDefault(),
                    SubTotal = (decimal)requestedItem.SubTotal,
                    Discount = requestedItem.Discount.GetValueOrDefault(),
                    DiscountPercent = requestedItem.DiscountPercent.GetValueOrDefault(),
                    TotalValue = (decimal)requestedItem.TotalValue,
                    Notes = requestedItem.Notes
                }).ToList();
                Context.OrderDetails.AddRange(orderDetails);
                Context.SaveChanges();

                // Get the new order number synchronously.
                var lastMerchantOrder = Context.MerchantOrders
                           .OrderByDescending(x => x.OrderNumber)
                           .Select(x => x.OrderNumber)
                           .FirstOrDefault();
                var newOrderNumber = lastOrder + 1;
                var requestedItemsByMerchant = model.Items.GroupBy(x => x.MerchantId);

                var createdOrderIds = new List<int>();

                foreach (var merchantGroup in requestedItemsByMerchant)
                {
                    serialNumber = DalHelper.GenerateSerialNumber(SerialType.PurchaseOrder, newOrderNumber);
                    var order = new MerchantOrder
                    {
                        MerchantId = (int)merchantGroup.Key,
                        OrderId = tbl_ord.OrderId,
                        OrderNumber = newOrderNumber,
                        SerialNumber = serialNumber,
                        UserId = UserId,
                        WorkflowStatusId = (int)WorkflowStatus.Pending,
                        SubTotal = Math.Round((decimal)merchantGroup.Sum(x => x.SubTotal), 2),
                        DeliveryValue = 0,
                        DiscountAmount = 0,
                        Tax = 0,
                        TotalValue = Math.Round((decimal)merchantGroup.Sum(x => x.TotalValue), 2) * (decimal)1.15,
                        OrderDate = now,
                        NetValue = Math.Round((decimal)merchantGroup.Sum(x => x.TotalValue), 2),//Math.Round(merchantGroup.Sum(x => x.NetValue.GetValueOrDefault()), 2),
                        Notes = model.Notes,
                        PaymentTypeId = model.PaymentTypeId.GetValueOrDefault(),
                        CreatedBy = UserId,
                        CreatedDate = now
                    };

                    Context.MerchantOrders.Add(order);
                    //Context.SaveChanges(); // Synchronous SaveChanges()

                    createdOrderIds.Add(order.MerchantOrderId);

                    //var orderDetails = new List<MerchantOrderDetail>();
                    //foreach (var requestedItem in merchantGroup)
                    //{
                    //    var orderDetail = new MerchantOrderDetail
                    //    {
                    //        MerchantOrderId = order.MerchantOrderId,
                    //        ItemId = requestedItem.MerchantItemId,
                    //        UnitId = requestedItem.UnitId,
                    //        Quantity = requestedItem.Quantity,
                    //        Price = requestedItem.Price.GetValueOrDefault(),
                    //        SubTotal = (decimal)requestedItem.SubTotal,
                    //        Discount = requestedItem.Discount.GetValueOrDefault(),
                    //        DiscountPercent = requestedItem.DiscountPercent.GetValueOrDefault(),
                    //        TotalValue = (decimal)requestedItem.TotalValue,
                    //        Notes = requestedItem.Notes
                    //    };
                    //    orderDetails.Add(orderDetail);
                    //}

                    //Context.MerchantOrderDetails.AddRange(orderDetails);
                    //Context.SaveChanges(); // Synchronous SaveChanges()
                    newOrderNumber++;
                }
                Context.SaveChanges(); // Synchronous SaveChanges()
                transaction.Commit();

                return new ActionsResponseModel
                {
                    Message = "Orders created successfully.",
                    Id = tbl_ord.OrderId,
                    Number = tbl_ord.SerialNumber.ToString(),
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
                    //order_tbl.MerchantId = model.MerchantId.GetValueOrDefault();
                    order_tbl.DeliveryValue = model.DeliveryValue;
                    order_tbl.DiscountAmount = model.Discount.GetValueOrDefault();
                    order_tbl.Tax = Math.Round(model.Tax.GetValueOrDefault(), 2);
                    order_tbl.PaymentTypeId = model.PaymentTypeId.GetValueOrDefault();
                    order_tbl.TotalValue = model.Items?.Sum(x => x.TotalValue) ?? 0;
                    order_tbl.NetValue = model.Items?.Sum(x => x.TotalValue) ?? 0;
                    //order_tbl.CountryId = model.CountryId;
                    //order_tbl.CityId = model.CityId;
                    //order_tbl.FullAddress = model.FullAddress;
                    //order_tbl.ReceiverName = model.ReceiverName;
                    //order_tbl.PhoneNumber = model.PhoneNumber;

                    order_tbl.ModifiedBy = model.ModifiedBy;
                    order_tbl.ModifiedDate = DateTime.Now;

                    Context.SaveChanges();

                    var OrderDetails = Context.OrderDetails.Where(x => x.OrderId == OrderId).ToList();
                    Context.OrderDetails.RemoveRange(OrderDetails);
                    Context.SaveChanges();

                    foreach (WebsiteOrderItemModel row in model.Items)
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
            var order = Context.Orders.FirstOrDefault(x => x.OrderId == OrderId);
            if (order != null && order.WorkflowStatusId != (int)WorkflowStatus.Cancelled)
            {
                order.WorkflowStatusId = (int)WorkflowStatus.Cancelled;
                order.ModifiedDate = DateTime.Now;
                var merchantOrder = Context.MerchantOrders.FirstOrDefault(x => x.OrderId == OrderId);
                if (merchantOrder != null && merchantOrder.WorkflowStatusId != (int)WorkflowStatus.Cancelled)
                {
                    merchantOrder.WorkflowStatusId = (int)WorkflowStatus.Cancelled;
                    merchantOrder.Notes = "order cancelled by customer";
                    merchantOrder.ModifiedDate = DateTime.Now;
                }

                Context.SaveChanges();
                return new ActionsResponseModel
                {
                    Id = OrderId,
                    IsSuccess = true,
                    Message = "Order Cancelled Successfly ",
                    Number = order.SerialNumber.ToString()
                };
            }
            else
            {
                return new ActionsResponseModel
                {
                    Id = OrderId,
                    IsSuccess = false,
                    Message = "can't cancel this order",
                    Number = order.SerialNumber.ToString()
                };
            }

        }

    }
}
