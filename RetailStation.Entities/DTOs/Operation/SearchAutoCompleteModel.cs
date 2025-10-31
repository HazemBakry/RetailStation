using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.DTOs.Operation
{
    public class SearchAutoCompleteModel
    {
        public int? SupplierItemId { get; set; }
        public string SearchText { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public decimal? Price { get; set; }
        public decimal? OfferPrice { get; set; }
        public string SupplierName { get; set; }
        public string ImageUrl { get; set; }

    }
}
