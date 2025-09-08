using Microsoft.AspNetCore.Mvc.ApplicationModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.DTOs.Roles
{
    public class CustomerApplicationModel
    {
        public string ApplicationId { get; set; }
        public string ApplicationName { get; set; }
        public string ApplicationThemeCssUrl { get; set; }
        public string ApplicationLogo { get; set; }
        public string ApplicationCode { get; set; }
        public string ApplicationUrl { get; set; }
        public int? DisplayOrder { get; set; }
        public bool IsDisplay { get; set; }
        public bool UseAngular { get; set; }
        public string RedirectUri { get; set; }
        public string LogoutRedirectUri { get; set; }
        public string ApplicationColor { get; set; }
        public string ApplicationStyle { get; set; }
        public bool IsCustomer { get; set; }
        public string RoleName { get; set; }
        public string[] RoleNames { get; set; }
        public string Icon { get; set; }
        public List<PagePermissionModel> Pages { get; set; }

    }
    public class ApplicationPageModel
    {
        public string ApplicationId { get; set; }
        public string ApplicationName { get; set; }
        public List<PagePermissionModel> Pages { get; set; }

    }
}
