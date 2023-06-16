using MasterErp.Entities.Models;
using MasterErp.Interface.HR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace MasterErp.API.Controllers.HR
{
    [Route("api/[controller]")]
    [ApiController]
    public class PenaltyController : ControllerBase
    {
        private readonly IPenaltyService _penaltyService;

        public PenaltyController(IPenaltyService penaltyService)
        {
            _penaltyService = penaltyService;
        }

        [HttpGet]
        [Route("GetPenaltyData")]
        public DataTable GetPenaltyData()
        {
            return _penaltyService.GetPenaltyData();
        }

        [HttpPost]
        [Route("AddNewPenalty")]
        public bool AddNewPenalty(Penalty model)
        {
            return _penaltyService.AddNewPenalty(model);
        }

        [HttpPost]
        [Route("EditPenalty")]
        public bool EditPenalty(Penalty model)
        {
            return _penaltyService.EditPenalty(model);
        }

        [HttpGet]
        [Route("DeletePenalty")]
        public bool DeletePenalty(int PenaltyId)
        {
            return _penaltyService.DeletePenalty(PenaltyId);
        }
    }
}
