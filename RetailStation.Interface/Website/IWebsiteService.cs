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
        List<SupplierItemModel> GetWebsitePromotionItems(SearchFilterModel model);
        List<WebsiteSliderModel> GetWebsiteMainSlider();

    }
}
