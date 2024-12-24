using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.Purchases;
using MasterErp.Entities.DTOs.Purchases;
using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.Purchase
{
    public interface ISuppliersService
    {
        List<SupplierDto> GetSuppliersData(SearchFilterModel model, int? SupplierId = null);
        SupplierDto GetSupplierDetailsById(SearchFilterModel model, int SupplierId);
        ActionsResponseModel AddNewSupplier(SupplierDto model);
        ActionsResponseModel EditSupplier(int SupplierId, SupplierDto model);
        ActionsResponseModel DeleteSupplier(int SupplierId);
        List<SupplierDto> GetSuppliersByItemId(int ItemId);
    }
}
