using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Enums;
using MasterErp.Entities.Models;
using MasterErp.Interface.Shared;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace MasterErp.API.Controllers.Shared
{
    [Route("api/[controller]")]
    [ApiController]
    public class SharedController : ControllerBase
    {
        private readonly ISharedService _sharedService;
        public SharedController(ISharedService sharedService)
        {
            _sharedService = sharedService;

        }
        [HttpGet]
        [Route("GetCustomersData")]
        public IActionResult GetCustomersData()
        {
            var results = _sharedService.GetCustomersData();
            return Ok(results);
        }


        [HttpGet]
        [Route("GetReceiptLedgersData")]
        public IActionResult GetReceiptLedgersData()
        {
            var results = _sharedService.GetReceiptLedgersData();
            return Ok(results);
        }

        [HttpGet]
        [Route("GetAccountsList")]
        public List<AccountTree> GetAccountsList(bool IsParent)
        {
            return _sharedService.GetAccountsList(IsParent);
        }
        [HttpGet]
        [Route("GetAccountsByTypeId")]
        public List<AccountTree> GetAccountsByTypeId(int TypeId)
        {
            return _sharedService.GetAccountsByTypeId(TypeId);
        }


        [HttpGet]
        [Route("GetReceiptLedgerTypes")]
        public IActionResult GetReceiptLedgerTypes()
        {
            var results = _sharedService.GetReceiptLedgerTypesData();
            return Ok(results);
        }

        [HttpGet]
        [Route("GetFinancialPeriods")]
        public IActionResult GetFinancialPeriods()
        {
            var results = _sharedService.GetFinancialPeriods();

            return Ok(results);
        }

        [HttpGet]
        [Route("GetAccountTypes")]
        public IActionResult GetAccountTypes()
        {
            var results = _sharedService.GetAccountTypes();

            return Ok(results);
        }



        [HttpGet]
        [Route("DownloadImporterTemplate")]
        public IActionResult DownloadImporterTemplate(ExcelExportStyle ImporterType)
        {
            var results = _sharedService.DownloadImporterTemplate(ImporterType);

            return Ok(results);
        }





        #region Selectors


        [HttpGet]
        [Route("GetBranchesSelector")]
        public IActionResult GetBranchesSelector()
        {
            var result = _sharedService.GetBranchesSelector();
            return Ok(result);
        }
        
        [HttpGet]
        [Route("GetBanksSelector")]
        public IActionResult GetBanksSelector()
        {
            var result = _sharedService.GetBanksSelector();
            return Ok(result);
        }        
        
        [HttpGet]
        [Route("GetNationalitiesSelector")]
        public IActionResult GetNationalitiesSelector()
        {
            var result = _sharedService.GetNationalitiesSelector();
            return Ok(result);
        }
         
        [HttpGet]
        [Route("GetIqamaIssuePlacesSelector")]
        public IActionResult GetIqamaIssuePlacesSelector()
        {
            var result = _sharedService.GetIqamaIssuePlacesSelector();
            return Ok(result);
        }
        
        [HttpGet]
        [Route("GetIqamaJobsSelector")]
        public IActionResult GetIqamaJobsSelector()
        {
            var result = _sharedService.GetIqamaJobsSelector();
            return Ok(result);
        }
        
        [HttpGet]
        [Route("GetCountriesSelector")]
        public IActionResult GetCountriesSelector()
        {
            var result = _sharedService.GetCountriesSelector();
            return Ok(result);
        }
        
        [HttpGet]
        [Route("GetCitiesSelector")]
        public IActionResult GetCitiesSelector()
        {
            var result = _sharedService.GetCitiesSelector();
            return Ok(result);
        }
        
        [HttpGet]
        [Route("GetRegionsSelector")]
        public IActionResult GetRegionsSelector()
        {
            var result = _sharedService.GetRegionsSelector();
            return Ok(result);
        }
         
        [HttpGet]
        [Route("GetSuppliersSelector")]
        public IActionResult GetSuppliersSelector()
        {
            var result = _sharedService.GetSuppliersSelector();
            return Ok(result);
        }
        
         
        [HttpGet]
        [Route("GetSupplierGroupsSelector")]
        public IActionResult GetSupplierGroupsSelector()
        {
            var result = _sharedService.GetSupplierGroupsSelector();
            return Ok(result);
        }


        #endregion
    }
}
