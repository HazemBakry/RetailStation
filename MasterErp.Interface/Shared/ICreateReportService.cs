using MasterErp.Entities.Common.Reports;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.Shared
{
    public interface ICreateReportService
    {
        string CreateGeneralReport(SearchReportModel Model);
    }
}
