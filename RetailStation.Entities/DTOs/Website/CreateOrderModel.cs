using RetailStation.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.DTOs.Website
{
 

    public class CreateOrderModel : CreatorModel
    {
        public int? OrderId { get; set; }
        public int? OrderNumber { get; set; }
        public int? SerialNumber { get; set; }
        public string DocNumber { get; set; }
        public string OrderDate { get; set; }
        public string DueDate { get; set; }
        public int? OrderTypeId { get; set; }
        public int? PaymentTypeId { get; set; }
        public decimal? DeliveryValue { get; set; }
        public decimal? SubTotal { get; set; }
        public decimal? Tax { get; set; }
        public decimal? TaxPercent { get; set; }
        public decimal? Discount { get; set; }
        public decimal? DiscountPercent { get; set; }
        public decimal TotalValue { get; set; }
        public decimal? NetValue { get; set; }
        public string Notes { get; set; }

        public int? CountryId { get; set; }
        public int? CityId { get; set; }
        public string FullAddress { get; set; }
        public string ReceiverName { get; set; }
        public string PhoneNumber { get; set; }


        public List<CreateOrderItemModel> Items { get; set; }
    }

    public class CreateOrderItemModel
    {
        public int MerchantItemId { get; set; }
        public int? ItemId { get; set; }
        public int? UnitId { get; set; }
        public int Quantity { get; set; }
        public decimal? Price { get; set; }
        public decimal? SubTotal { get; set; }
        public decimal? Discount { get; set; }
        public decimal? DiscountPercent { get; set; }
        public decimal? TotalValue { get; set; }
        public decimal? NetValue { get; set; }
        public string Notes { get; set; }
        public int? MerchantId { get; set; }
    }
}
