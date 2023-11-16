using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Common
{
    public class RawItemModel
    {
        public int RawItemId { get; set; }
        public string NameEn { get; set; }
        public string NameAr { get; set; }
        public double? PurchasePrice { get; set; }
        public double? Yield { get; set; }
        public double? Cost { get; set; }
        public int SubUnitId { get; set; }
        public int MainUnitId { get; set; }
        public bool IsActive { get; set; }
        public string SubUnitName { get; set; }
        public string MainUnitName { get; set; }
        public int ConvertRatio { get; set; }
        public int? RawCategoryId { get; set; }
        public string CategoryName { get; set; }
        public string InsertUser { get; set; }
        public DateTime InsertDate { get; set; }
        public int ItemType { get; set; }
        public int RicepesItemId { get; set; }
        public int RicepesUnitId { get; set; }
        public string RicepesItemName { get; set; }
        public string RicepesUnitNameEn { get; set; }
        public double RicepesTotalValue { get; set; }
        public double RicepesQuantity { get; set; }
        public double RicepesPrice { get; set; }

        public int SupplierItemId { get; set; }
        public int SupplierId { get; set; }
        public string SupplierItemName { get; set; }
        public string SupplierName { get; set; }
        public List<ItemSupplier> ItemsSupplier { get; set; }
    }
}
