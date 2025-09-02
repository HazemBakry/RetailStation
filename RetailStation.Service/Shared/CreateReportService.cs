using RetailStation.Entities.Common.Reports;
using RetailStation.Interface.Shared;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace RetailStation.Service.Shared
{
    public class CreateReportService : ICreateReportService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IHelper _helper;
        public CreateReportService(IHelper helper, IHttpContextAccessor httpContextAccessor)
        {
            _helper = helper;
            _httpContextAccessor = httpContextAccessor;
        }
        public string CreateGeneralReport(SearchReportModel Model)
        {
            var request = _httpContextAccessor.HttpContext?.Request;
            if (request == null) return null;
            string jwtToken = request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            if (string.IsNullOrEmpty(jwtToken)) return null;

            string angularDomain = request.Headers["Origin"].ToString();
            if (string.IsNullOrEmpty(angularDomain)) return null;

            UriBuilder urlBuilder = new UriBuilder($"{angularDomain}/create-report/{Model.PageName}/{Model.ControllerName}/{Model.ApiName}/{Model.MethodType}");

            if (Model.FilterItems != null && Model.FilterItems.Count > 0)
            {
                var query = HttpUtility.ParseQueryString(string.Empty);
                foreach (var filter in Model.FilterItems)
                {
                    query[filter.CategoryName] = filter.ItemFlag;
                }
                urlBuilder.Query = query.ToString();
            }

            string URL = urlBuilder.ToString();

            var HTML = WebSiteHtmlLoader.RenderedHtmlPage(URL, jwtToken);
            if (string.IsNullOrEmpty(HTML))
                return null;

            var FilePath = _helper.SaveHTMLResult(HTML, Model.IsLandScape);
            return FilePath;
        }
    }
}
