using MasterErp.Entities.Common.Inventory.PurchasesRequests;
using MasterErp.Entities.Common;
using MasterErp.Entities.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MasterErp.Entities.Common.Finance.GeneralAccounts;
using MasterErp.Interface.GeneralAccounts;
using MasterErp.Service.GeneralAccounts;
using System.Linq;
using Microsoft.AspNetCore.Authorization;

namespace MasterErp.API.Controllers.Finance.GeneralAccounts
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class ReceiptLedgerController : ControllerBase
    {

        private readonly IReceiptLedgerService _receiptLedgerService;

        public ReceiptLedgerController(IReceiptLedgerService receiptLedgerService)
        {
            _receiptLedgerService = receiptLedgerService;
        }


        [HttpPost]
        [Route("GetReceiptLedgersData")]
        public IActionResult GetReceiptLedgersData(SearchFilterModel model)
        {
            var data = _receiptLedgerService.GetReceiptLedgersData(model);
            var result = new PagedResponseModel<ReceiptLedgerModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }

        [HttpPost]
        [Route("CreateNewReceiptLedger")]
        public IActionResult CreateNewReceiptLedger(ReceiptLedgerModel Model)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            Model.CreatedBy = UserId;
            var results = _receiptLedgerService.CreateNewReceiptLedger(Model);
            return Ok(results);
        }
        [HttpPost]
        [Route("EditReceiptLedger")]
        public IActionResult EditReceiptLedger(int ReceiptLedgerId, ReceiptLedgerModel Model)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            Model.ModifiedBy = UserId;
            var results = _receiptLedgerService.EditReceiptLedger(ReceiptLedgerId, Model);
            return Ok(results);
        }
        [HttpGet]
        [Route("DeleteReceiptLedger")]
        public IActionResult DeleteReceiptLedger(int ReceiptLedgerId)
        {
            var results = _receiptLedgerService.DeleteReceiptLedger(ReceiptLedgerId);
            return Ok(results);
        }

    }
}
