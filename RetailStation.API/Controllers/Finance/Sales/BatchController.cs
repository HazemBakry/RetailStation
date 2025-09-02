using MasterErp.Entities.Common;
using MasterErp.Entities.Models.Finance;
using MasterErp.Interface.GeneralAccounts.Customers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace MasterErp.API.Controllers.Finance.Sales
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class BatchController : ControllerBase
    {
        private readonly IBatchService _batchService;
        public BatchController(IBatchService batchService)
        {
            _batchService = batchService;
        }

        [HttpPost("GetBatchData")]
        public DataTable GetBatchData(FilterModel model)
        {
            var results = _batchService.GetBatchData(model);
            return results;
        }

        [HttpPost("AddNewBatch")]
        public ActionsResponseModel AddNewBatch(Batch Model)
        {
            var results = _batchService.AddNewBatch(Model);
            return results;
        }

        [HttpPost("EditBatch")]
        public ActionsResponseModel EditBatch(Batch Model)
        {
            var results = _batchService.EditBatch(Model);
            return results;
        }

        [HttpGet("DeleteBatch")]
        public ActionsResponseModel DeleteBatch(int BatchId)
        {
            var results = _batchService.DeleteBatch(BatchId);
            return results;
        }
    }
}
