using MasterErp.Entities.Common;
using MasterErp.Entities.Models.Finance;
using MasterErp.Interface.GeneralAccounts.GeneralAccountSettings;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace MasterErp.API.Controllers.Finance.GeneralAccounts
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AssetsFormController : ControllerBase
    {
        private readonly IAssetsFormService _assetsFormService;
        public AssetsFormController(IAssetsFormService assetsFormService)
        {
            _assetsFormService = assetsFormService;
        }

        [HttpPost("GetAssetsFormData")]
        public DataTable GetAssetsFormData(FilterModel model)
        {
            var results = _assetsFormService.GetAssetsFormData(model);
            return results;
        }

        [HttpPost("AddNewAssetsForm")]
        public ActionsResponseModel AddNewAssetsForm(AssetsForm Model)
        {
            var results = _assetsFormService.AddNewAssetsForm(Model);
            return results;
        }

        [HttpPost("EditAssetsForm")]
        public ActionsResponseModel EditAssetsForm(AssetsForm Model)
        {
            var results = _assetsFormService.EditAssetsForm(Model);
            return results;
        }

        [HttpGet("DeleteAssetsForm")]
        public ActionsResponseModel DeleteAssetsForm(int AssetsFormId)
        {
            var results = _assetsFormService.DeleteAssetsForm(AssetsFormId);
            return results;
        }
    }
}
