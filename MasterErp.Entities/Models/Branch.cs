using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    public class Branch
    {
		[Key]
		public int BranchID { get; set; }
		public string Code { get; set; }
		public int BranchOrder { get; set; }
		public int? BranchIDNewPOS { get; set; }
		public string NameAR { get; set; }
		public string NameEN { get; set; }
		public bool IsActive { get; set; }
		public bool IsAdmin { get; set; }
		public bool IsBranch { get; set; }
		public int CityID { get; set; }
		public int DrawingsCostCenterID { get; set; }
		public int ExpensesCostCenterID { get; set; }
		public string Phone { get; set; }
		public string Email { get; set; }
		public string Fax { get; set; }
		public string Address { get; set; }
		public string Notes { get; set; }
		public int SalesDiningAccountID { get; set; }
		public int SalesCarryoutAccountID { get; set; }
		public int SalesDeliveryAccountID { get; set; }
		public int SalesDeliveryFeesAccountID { get; set; }
		public int SalesCateringAccountID { get; set; }
		public int? SalesFamilyAccountID { get; set; }
		public int? SalesSwyftAccountID { get; set; }
		public int? SalesSwyftCustomerAccountID { get; set; }
		public int? SalesHungerAccountID { get; set; }
		public int? SalesHungerCustomerAccountID { get; set; }
		public int? SalesCarriageAccountID { get; set; }
		public int? SalesCarriageCustomerAccountID { get; set; }
		public int? SalesCareemAccountID { get; set; }
		public int? SalesCareemCustomerAccountID { get; set; }
		public int? SalesToYouAccountID { get; set; }
		public int? SalesToYouCustomerAccountID { get; set; }
		public int? SalesHotelsAccountID { get; set; }
		public int? SalesHotelsCustomerAccountID { get; set; }
		public int? SalesWsselAccountID { get; set; }
		public int? SalesWsselCustomerAccountID { get; set; }
		public int? SalesMegathyAccountID { get; set; }
		public int? SalesMegathyCustomerAccountID { get; set; }
		public int? SalesMrsoolAccountID { get; set; }
		public int? SalesMrsoolCustomerAccountID { get; set; }
		public int? SalesUberAccountID { get; set; }
		public int? SalesUberCustomerAccountID { get; set; }
		public int? SalesTHECHEFZAccountID { get; set; }
		public int? SalesTHECHEFZCustomerAccountID { get; set; }
		public int? SalesJahezAccountID { get; set; }
		public int? SalesJahezCustomerAccountID { get; set; }
		public int? SalesKoinzAccountID { get; set; }
		public int? SalesKoinzCustomerAccountID { get; set; }
		public int? SalesShgardiAccountID { get; set; }
		public int? SalesShgardiCustomerAccountID { get; set; }
		public int? SalesEasyTakeAccountID { get; set; }
		public int? SalesEasyTakeCustomerAccountID { get; set; }
		public int? SalesIntertainerAccountID { get; set; }
		public int? SalesIntertainerCustomerAccountID { get; set; }
		public int? SalesSahmAccountID { get; set; }
		public int? SalesSahmCustomerAccountID { get; set; }
		public int InsertUser { get; set; }
		public DateTime InsertDate { get; set; }
		public int UpdateUser { get; set; }
		public DateTime UpdateDate { get; set; }
	}
}
