using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.Purchases;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.Finance.Purchase
{
    public interface ISuppliersService
    {
        List<SupplierDto> GetAllSuppliers(int? SupplierId=null);
        SupplierDto GetSupplierById(int SupplierId);
        ActionsResponseModel AddNewSupplier(SupplierDto model);
        ActionsResponseModel EditSupplier(int SupplierId, SupplierDto model);
        ActionsResponseModel DeleteSupplier(int SupplierId);
    }
}
