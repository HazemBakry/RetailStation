using RetailStation.Entities.Common;
using RetailStation.Entities.Common.Finance.Purchases;
using RetailStation.Entities.Common.Inventory.ReceiveOrder;
using RetailStation.Entities.DTOs.Inventory;
using RetailStation.Entities.DTOs.Operation;
using RetailStation.Entities.DTOs.Purchases;
using RetailStation.Entities.Models.Operation;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Interface.Operation
{
    public interface IAdminService
    {
        #region Slider

        List<SliderModel> GetSlidersData(SearchFilterModel filterModel, int? sliderId = null);
        SliderModel GetSliderById(int sliderId);
        Task<ActionsResponseModel> AddSlider(SliderModel model);
        Task<ActionsResponseModel> EditSlider(int sliderId, SliderModel model);
        ActionsResponseModel DeleteSlider(int sliderId);
        ActionsResponseModel ChangeSliderActiveStatus(int sliderId);



        #endregion

        #region Promotions
        List<PromotionModel> GetPromotionsData(SearchFilterModel filterModel, int? promotionId = null);
        PromotionModel GetPromotionById(int promotionId);
        Task<ActionsResponseModel> AddPromotion(PromotionModel model);
        Task<ActionsResponseModel> EditPromotion(int promotionId, PromotionModel model);
        ActionsResponseModel DeletePromotion(int promotionId);
        ActionsResponseModel ChangePromotionActiveStatus(int promotionId);
        #endregion
        #region TopPartners
        List<TopPartnerModel> GetTopPartners_Data(SearchFilterModel filterModel, int? promotionId = null);
        TopPartnerModel GetTopPartnerById(int promotionId);
        Task<ActionsResponseModel> AddTopPartner(TopPartnerModel model);
        Task<ActionsResponseModel> EditTopPartner(int promotionId, TopPartnerModel model);
        ActionsResponseModel DeleteTopPartner(int promotionId);
        ActionsResponseModel ChangeTopPartnerActiveStatus(int promotionId);
        #endregion

        #region BestSellerItems
        List<BestSellerItemModel> GetBestSellerItems_Data();
        ActionsResponseModel UpdateBestSellerItems(List<BestSellerItemModel> BestSellerItems);
        #endregion

    }
}
