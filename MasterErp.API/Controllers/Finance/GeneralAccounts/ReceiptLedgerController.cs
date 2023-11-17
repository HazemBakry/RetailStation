using MasterErp.Entities.Common.Inventory.PurchasesRequests;
using MasterErp.Entities.Common;
using MasterErp.Entities.Models;
using MasterErp.Interface.Finance.GeneralAccounts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MasterErp.Entities.Common.Finance.GeneralAccounts;

namespace MasterErp.API.Controllers.Finance.GeneralAccounts
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReceiptLedgerController : ControllerBase
    {

        private readonly IReceiptLedgerService _receiptLedgerService;

        public ReceiptLedgerController(IReceiptLedgerService receiptLedgerService)
        {
            _receiptLedgerService = receiptLedgerService;
        }


        [HttpPost]
        [Route("GetReceiptLedgersData")]
        public IActionResult GetReceiptLedgersData(FilterModel model)
        {
            var results = _receiptLedgerService.GetReceiptLedgersData(model);

            return Ok(results);
        }

        [HttpPost]
        [Route("CreateNewReceiptLedger")]
        public IActionResult CreateNewReceiptLedger(ReceiptLedgerModel Model)
        {
            var results = _receiptLedgerService.CreateNewReceiptLedger(Model);
            return Ok(results);
        }
    }
}
