using RetailStation.Entities.Common.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models
{
    [Table("Orders", Schema = "Website")]

    public class Order : CreatorModel
    {
        public int OrderId { get; set; }
        public int OrderNumber { get; set; }
        public string SeialNumber { get; set; }
        public int WorkflowStatusId { get; set; }
        public decimal SubTotal { get; set; }
        public decimal? DeliveryValue { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal Tax { get; set; }
        public decimal TotalValue { get; set; }
        public DateTime? OrderDate { get; set; }
        public decimal NetValue { get; set; }
        public bool IsDeleted { get; set; }
        public int SupplierId { get; set; }
        public string Notes { get; set; }
        public int PaymentTypeId { get; set; }
    }
}
