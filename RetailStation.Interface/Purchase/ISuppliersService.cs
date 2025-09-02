using RetailStation.Entities.Common;
using RetailStation.Entities.Common.Finance.Purchases;
using RetailStation.Entities.DTOs.Purchases;
using RetailStation.Entities.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Interface.Purchase
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
