using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.HR
{
    public interface ISickLeaveService
    {
        DataTable GetSickLeaveData();
        bool AddNewSickLeave(SickLeave model);
        bool EditSickLeave(SickLeave model);
        bool DeleteSickLeave(int SickLeaveId);
    }
}
