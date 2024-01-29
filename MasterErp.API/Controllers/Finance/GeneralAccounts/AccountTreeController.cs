using MasterErp.Entities.Common;
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
using System.Security.Claims;
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
        
        [HttpPost]
        [Route("UpdateAccountTree")]

        public IActionResult UpdateAccountTree(int AccountId,AccountTreeModel Model)
        {
            var results = _accountTreeService.UpdateAccountTree(AccountId, Model);
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
        [Route("GetAccountTreeHierarchicalData")]
        public IActionResult GetAccountTreeHierarchicalData(string SearchText)
        {
            var results = _accountTreeService.GetAccountTreeHierarchicalData(SearchText);
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


        [HttpPost("ImportAccountTreeList")]
        public IActionResult ImportAccountTreeList(IFormFile File)
        {
            var results= _accountTreeService.ImportAccountTreeList(File);

            return Ok(results);
        }
        [HttpGet("ExportAccountTreeList")]
        public IActionResult ExportAccountTreeList(string SearchText)
        {
            var results= _accountTreeService.ExportAccountTreeList(SearchText);

            return Ok(results);
        }

        #region OpeningBalance
        //[HttpPost]
        //[Route("CreateNewOpeningBalance")]

        //public IActionResult CreateNewOpeningBalance(AccountOpeningBalanceModel Model)
        //{
        //    var results = _accountTreeService.CreateNewOpeningBalance(Model);
        //    return Ok(results);
        //}

        [HttpPost]
        [Route("UpdateAccountsOpeningBalance")]

        public IActionResult UpdateAccountsOpeningBalance(List<AccountTreeModel> Model)
        {
            var results = _accountTreeService.UpdateAccountsOpeningBalance(Model);
            return Ok(results);
        }

        [HttpGet]
        [Route("GetAccountsOpeningBalanceData")]
        public IActionResult GetAccountsOpeningBalanceData(string SearchText)
        {
            var results = _accountTreeService.GetAccountsOpeningBalanceData(SearchText);
            return Ok(results);
        }
        #endregion

    }
}
