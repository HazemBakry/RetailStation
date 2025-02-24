using MasterErp.Entities.Common;
using MasterErp.Entities.Models;
using MasterErp.Interface.GeneralAccounts.Customers;
using MasterErp.Interface.GeneralAccounts.GeneralAccountSettings;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace MasterErp.API.Controllers.Finance.Sales
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerService _customerService;
        public CustomerController(ICustomerService customerService)
        {
            _customerService = customerService;
        }

        [HttpPost("GetCustomerData")]
        public DataTable GetCustomerData(FilterModel model)
        {
            var results = _customerService.GetCustomerData(model);
            return results;
        }

        [HttpPost("AddNewCustomer")]
        public ActionsResponseModel AddNewCustomer(Customer Model)
        {
            var results = _customerService.AddNewCustomer(Model);
            return results;
        }

        [HttpPost("EditCustomer")]
        public ActionsResponseModel EditCustomer(Customer Model)
        {
            var results = _customerService.EditCustomer(Model);
            return results;
        }

        [HttpGet("DeleteCustomer")]
        public ActionsResponseModel DeleteCustomer(int CustomerId)
        {
            var results = _customerService.DeleteCustomer(CustomerId);
            return results;
        }
    }
}
