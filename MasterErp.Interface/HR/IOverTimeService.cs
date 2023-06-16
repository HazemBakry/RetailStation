using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.HR
{
    public interface IOverTimeService
    {
        DataTable GetOverTimeData();
        bool AddNewOverTime(OverTime model);
        bool EditOverTime(OverTime model);
        bool DeleteOverTime(int OverTimeId);
    }
}
