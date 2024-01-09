using MasterErp.Entities.Common.Finance.GeneralAccounts;
using MasterErp.Entities.Models;
using MasterErp.Interface.Finance.GeneralAccounts;
using MasterErp.Service.Finance.GeneralAccounts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace MasterErp.API.Controllers.Finance.GeneralAccounts
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountTreeController : ControllerBase
    {
        private readonly IAccountTreeService _accountTreeService;

        public AccountTreeController(IAccountTreeService accountTreeService)
        {
            _accountTreeService = accountTreeService;
        }

        [HttpPost]
        [Route("CreateNewAccount")]

        public IActionResult CreateNewAccount(AccountTreeModel Model)
        {
            var results = _accountTreeService.CreateNewAccount(Model);
            return Ok(results);
        }


        [HttpGet]
        [Route("GetAccountTreeData_Old")]
        public DataTable GetAccountTreeData_Old(string SearchText)
        {
            return _accountTreeService.GetAccountTreeData_Old(SearchText);
        }

        [HttpGet]
        [Route("GetAccountTreeData")]
        public IActionResult GetAccountTreeData(string SearchText)
        {
            var results= _accountTreeService.GetAccountTreeData(SearchText);
            return Ok(results);
        }
        [HttpGet]
        [Route("GetAccountsList")]
        public List<AccountTree> GetAccountsList(bool IsParent)
        {
            return _accountTreeService.GetAccountsList(IsParent);
        }

        [HttpGet]
        [Route("GetChildAccountsList")]
        public List<AccountTree> GetChildAccountsList()
        {
            return _accountTreeService.GetChildAccountsList();
        }


    }
}
