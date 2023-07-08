using MasterErp.Entities.Models;
using MasterErp.Interface.Finance.GeneralAccounts;
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

        [HttpGet]
        [Route("GetAccountTreeData")]
        public DataTable GetAccountTreeData(string SearchText)
        {
            return _accountTreeService.GetAccountTreeData(SearchText);
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
