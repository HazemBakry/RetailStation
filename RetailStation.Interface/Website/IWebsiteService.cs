using RetailStation.Entities.Common;
using RetailStation.Entities.DTOs.Operation;
using RetailStation.Entities.DTOs.Website;
using RetailStation.Entities.Models.Operation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Interface.Website
{
    public interface IWebsiteService
    {
        List<SliderModel> GetWebsiteMainSlider();
        List<ItemCategoryModel> GetWebsiteHomeCategories(int? CategoryId = null);
        List<ItemDto> GetItemsByCategoryId(int CategoryId, SearchFilterModel model);
        List<MerchantItemModel> GetWebsiteItems_Data(string UserId, SearchFilterModel FilterModel);
        List<FilterModel> GetWebsiteItems_Filters(SearchFilterModel FilterModel);
        MerchantItemModel GetWebsiteItemDetailsById(int MerchantItemId);
        List<PromotionModel> GetWebsitePromotionItems(SearchFilterModel model);
        List<TopPartner> GetTopPartners();
        ActionsResponseModel ToggleFavorite(string userId, int MerchantItemId);
        List<SearchAutoCompleteModel> SearchAutoComplete(string SearchText);

    }
}
