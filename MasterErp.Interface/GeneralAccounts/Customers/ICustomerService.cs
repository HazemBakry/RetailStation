using MasterErp.Entities.Common;
using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.GeneralAccounts.Customers
{
    public interface ICustomerService
    {
        DataTable GetCustomerData(FilterModel model);
        ActionsResponseModel AddNewCustomer(Customer Model);
        ActionsResponseModel EditCustomer(Customer Model);
        ActionsResponseModel DeleteCustomer(int CustomerId);
    }
}
