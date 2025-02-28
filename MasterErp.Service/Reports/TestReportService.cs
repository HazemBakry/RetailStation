using MasterErp.Interface.Reports;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.Reports
{
    public class TestReportService : ITestReportService
    {
        private readonly IHelper _helper;
        public TestReportService(IHelper helper)
        {
            _helper = helper;
        }
        public string CreateTestReport()
        {
            var HTML = WebSiteHtmlLoader.RenderedHtmlPage("http://localhost:4200/reports");
            if (string.IsNullOrEmpty(HTML))
                return null;

            var FilePath = _helper.SaveHTMLResult(HTML);
            return FilePath;
        }
    }
}
