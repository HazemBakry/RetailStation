using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Enums;
using MasterErp.Entities.Models.Finance;
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
        [Route("GetLeadgerJournalsData")]
        public IActionResult GetLeadgerJournalsData()
        {
            var results = _sharedService.GetLeadgerJournalsData();
            return Ok(results);
        }

        [HttpGet]
        [Route("GetReceiptLedgersSelector")]
        public IActionResult GetReceiptLedgersSelector()
        {
            var results = _sharedService.GetReceiptLedgersSelector();
            return Ok(results);
        }

        [HttpGet]
        [Route("GetAccountsSelector")]
        public List<SelectorDataModel> GetAccountsSelector(bool? IsGroup)
        {
            return _sharedService.GetAccountsSelector(IsGroup);
        }
        [HttpGet]
        [Route("GetAccountsByTypeId")]
        public List<SelectorDataModel> GetAccountsByTypeId(int TypeId)
        {
            return _sharedService.GetAccountsByTypeId(TypeId);
        }

        [HttpGet]
        [Route("GetCostCenterSelector")]
        public List<SelectorDataModel> GetCostCenterSelector(bool IsParent)
        {
            return _sharedService.GetCostCenterSelector(IsParent);
        }
        [HttpGet]
        [Route("GetJournalTemplatesSelector")]
        public List<SelectorDataModel> GetJournalTemplatesSelector()
        {
            return _sharedService.GetJournalTemplatesSelector();
        }

        [HttpGet]
        [Route("GetFinancialPeriods")]
        public IActionResult GetFinancialPeriods()
        {
            var results = _sharedService.GetFinancialPeriods();

            return Ok(results);
        }

        [HttpGet]
        [Route("GetCurrentFinancialPeriod")]
        public IActionResult GetCurrentFinancialPeriod()
        {
            var results = _sharedService.GetCurrentFinancialPeriod();

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
        [Route("GetSponsorsSelector")]
        public IActionResult GetSponsorsSelector()
        {
            var result = _sharedService.GetSponsorsSelector();
            return Ok(result);
        }

        [HttpGet]
        [Route("GetOrderStatusSelector")]
        public IActionResult GetOrderStatusSelector()
        {
            var result = _sharedService.GetOrderStatusSelector();
            return Ok(result);
        }

        [HttpGet]
        [Route("GetStoresSelector")]
        public IActionResult GetStoresSelector()
        {
            var result = _sharedService.GetStoresSelector();
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
        [Route("GetVisaJobsSelector")]
        public IActionResult GetVisaJobsSelector()
        {
            var result = _sharedService.GetVisaJobsSelector();
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
        [Route("GetCustomersSelector")]
        public IActionResult GetCustomersSelector()
        {
            var result = _sharedService.GetCustomersSelector();
            return Ok(result);
        }

        [HttpGet]
        [Route("GetSupplierGroupsSelector")]
        public IActionResult GetSupplierGroupsSelector()
        {
            var result = _sharedService.GetSupplierGroupsSelector();
            return Ok(result);
        }
        [HttpGet]
        [Route("GetPurchaseInvoiceTypesSelector")]
        public IActionResult GetPurchaseInvoiceTypesSelector()
        {
            var result = _sharedService.GetPurchaseInvoiceTypesSelector();
            return Ok(result);
        }
        [HttpGet]
        [Route("GetItemsSelector")]
        public IActionResult GetItemsSelector()
        {
            var result = _sharedService.GetItemsSelector();
            return Ok(result);
        }
        [HttpGet]
        [Route("GetItemCategoriesSelector")]
        public IActionResult GetItemCategoriesSelector()
        {
            var result = _sharedService.GetItemCategoriesSelector();
            return Ok(result);
        }
        [HttpGet]
        [Route("GetUnitsSelector")]
        public IActionResult GetUnitsSelector()
        {
            var result = _sharedService.GetUnitsSelector();
            return Ok(result);
        }
        [HttpGet]
        [Route("GetChildAccountsSelector")]
        public IActionResult GetChildAccountsSelector()
        {
            var result = _sharedService.GetChildAccountsSelector();
            return Ok(result);
        }

        [HttpGet]
        [Route("GetItemLookupsSelector")]
        public IActionResult GetItemLookupsSelector()
        {
            var result = _sharedService.GetItemLookupsSelector();
            return Ok(result);
        }

        [HttpGet]
        [Route("GetArabicEnglishNumberText")]
        public IActionResult GetArabicEnglishNumberText(int ReceiptId)
        {
            var result = _sharedService.GetArabicEnglishNumberText(ReceiptId);
            return Ok(result);
        }
        [HttpGet]
        [Route("GetDepartmentsSelector")]
        public IActionResult GetDepartmentsSelector()
        {
            var result = _sharedService.GetDepartmentsSelector();
            return Ok(result);
        }

        #endregion
    }
}
