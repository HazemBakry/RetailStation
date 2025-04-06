using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.Finance
{
    [Table("PaymentOrders", Schema = "Finance")]

    public class PaymentOrder: CreatorModel
    {
        [Key]
        public int PaymentOrderId { get; set; }
        public int? OrderNumber { get; set; }
        public DateTime ReleaseDate { get; set; }
        public string ContactName { get; set; }
        public int? PaymentTypeId { get; set; }
        public int? AgencyTypeId { get; set; }
        public int? FromAccountId { get; set; }
        public int? AccountId { get; set; }
        public int? SupplierId { get; set; }
        public int? CustomerId { get; set; }
        public int? EmployeeId { get; set; }
        public double MoneyAmount { get; set; }
        public int? CurrencyId { get; set; }
        public string Description { get; set; }
        public int? WorkflowStatusId { get; set; }


    }
}
