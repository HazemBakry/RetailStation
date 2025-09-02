using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.Purchases;
using MasterErp.Entities.DTOs.Purchases;
using MasterErp.Entities.Models;


namespace MasterErp.Interface.Purchase
{
    public interface ISupplierReturnsVoucherService
    {
        PagedResponseModel<SupplierReturnsVoucherDTO> GetSupplierReturnsVoucherData(FilterModel model);
        ActionsResponseModel CreateNewSupplierReturnsVoucher(OrderModel model);


    }
}
