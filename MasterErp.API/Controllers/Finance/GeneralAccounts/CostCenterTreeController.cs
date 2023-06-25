using MasterErp.Entities.Models;
using MasterErp.Interface.Finance.GeneralAccounts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
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

        [HttpGet]
        [Route("GetCostCenterTreeData")]
        public List<CostCenterTree> GetCostCenterTreeData()
        {
            return _costCenterTreeService.GetCostCenterTreeData();
        }
    }
}
