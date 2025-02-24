using MasterErp.Entities.Common.Finance.GeneralAccounts;
using MasterErp.Entities.Models.Finance;
using MasterErp.Interface.GeneralAccounts;
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
    public class CostCenterTreeController : ControllerBase
    {
        private readonly ICostCenterTreeService _costCenterTreeService;

        public CostCenterTreeController(ICostCenterTreeService costCenterTreeService)
        {
            _costCenterTreeService = costCenterTreeService;
        }

        [HttpPost]
        [Route("CreateNewCostCenter")]

        public IActionResult CreateNewCostCenter(CostCenterTreeModel Model)
        {
            var results = _costCenterTreeService.CreateNewCostCenter(Model);
            return Ok(results);
        }

        [HttpPost]
        [Route("UpdateCostCenterTree")]

        public IActionResult UpdateCostCenterTree(int CostCenterId, CostCenterTreeModel Model)
        {
            var results = _costCenterTreeService.UpdateCostCenterTree(CostCenterId, Model);
            return Ok(results);
        }


        [HttpGet]
        [Route("GetCostCenterTreeHierarchicalData")]
        public IActionResult GetCostCenterTreeHierarchicalData(string SearchText)
        {
            var results = _costCenterTreeService.GetCostCenterTreeHierarchicalData(SearchText);
            return Ok(results);
        }



        [HttpGet]
        [Route("GetCostCenterTreeData")]
        public List<CostCenterTree> GetCostCenterTreeData(bool IsParent)
        {
            return _costCenterTreeService.GetCostCenterTreeData(IsParent);
        }


        [HttpPost("ImportCostCenterTreeList")]
        public IActionResult ImportCostCenterTreeList(IFormFile File)
        {
            var results = _costCenterTreeService.ImportCostCenterTreeList(File);

            return Ok(results);
        }
        [HttpGet("ExportCostCenterTreeList")]
        public IActionResult ExportCostCenterTreeList(string SearchText)
        {
            var results = _costCenterTreeService.ExportCostCenterTreeList(SearchText);

            return Ok(results);
        }
    }
}
