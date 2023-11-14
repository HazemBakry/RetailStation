using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.Purchases;
using MasterErp.Entities.Models;


namespace MasterErp.Interface.Finance.Purchase
{
    public interface ISupplierReturnsVoucherService
    {
        PagedResponseDTO<SupplierReturnsVoucher> GetSupplierReturnsVoucherData(FilterModel model);
        CreateModifyReturnsModel CreateNewSupplierReturnsVoucher(SupplierReturnsVoucherModel model);


    }
}
