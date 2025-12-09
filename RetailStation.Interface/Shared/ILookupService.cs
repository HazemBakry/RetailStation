using RetailStation.Entities.Common;
using RetailStation.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Interface.Shared
{
    public interface ILookupService
    {
        #region Global Lookups

        List<SelectorDataModel> GetPaymentMethods();
        #endregion

    }
}
