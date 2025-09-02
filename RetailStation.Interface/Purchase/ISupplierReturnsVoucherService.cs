using RetailStation.Entities.Common;
using RetailStation.Entities.Common.Finance.Purchases;
using RetailStation.Entities.DTOs.Purchases;
using RetailStation.Entities.Models;


namespace RetailStation.Interface.Purchase
{
    public interface ISupplierReturnsVoucherService
    {
        PagedResponseModel<SupplierReturnsVoucherDTO> GetSupplierReturnsVoucherData(FilterModel model);
        ActionsResponseModel CreateNewSupplierReturnsVoucher(OrderModel model);


    }
}
