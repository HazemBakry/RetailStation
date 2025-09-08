using RetailStation.Entities.Common;
using RetailStation.Entities.Models.Subscription;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Interface.GeneralAccounts.Customers
{
    public interface ICustomerService
    {
        DataTable GetCustomerData(FilterModel model);
        ActionsResponseModel AddNewCustomer(Customer Model);
        ActionsResponseModel EditCustomer(Customer Model);
        ActionsResponseModel DeleteCustomer(int CustomerId);
    }
}
