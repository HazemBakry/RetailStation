using RetailStation.Entities.Common;
using RetailStation.Entities.DTOs.Operation;
using RetailStation.Entities.DTOs.Website;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Interface.Website
{
    public interface IWebsiteService
    {
        List<SupplierItemModel> GetWebsiteItems_Data(SearchFilterModel FilterModel);
        List<FilterModel> GetWebsiteItems_Filters(SearchFilterModel FilterModel);
        SupplierItemModel GetWebsiteItemDetailsById(int SupplierItemId);
        List<PromotionModel> GetWebsitePromotionItems(SearchFilterModel model);
        List<SliderModel> GetWebsiteMainSlider();

    }
}
