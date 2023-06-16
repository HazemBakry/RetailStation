using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.HR
{
    public interface IPenaltyService
    {
        DataTable GetPenaltyData();
        bool AddNewPenalty(Penalty model);
        bool EditPenalty(Penalty model);
        bool DeletePenalty(int PenaltyId);
    }
}
