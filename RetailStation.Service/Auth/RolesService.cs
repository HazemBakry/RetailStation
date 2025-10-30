using RetailStation.Entities.DTOs.Roles;
using RetailStation.Entities.Models;
using RetailStation.Interface.Roles;
using RetailStation.Entities.Common;
using RetailStation.Interface.Common;
using Microsoft.AspNetCore.Identity;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;


namespace RetailStation.Service.Roles
{

    public class RolesService : IRolesService
    {
        private readonly DBContext Context;
        private readonly SubscriptionDbContext SubscriptionContext;
        private readonly IConfiguration Configuration;
        private readonly ISQLHelper SQLHelper;
        private readonly RoleManager<IdentityRole> RoleManager;
        private readonly string ConnectionString;
        private readonly string SubscriptionDB;
        private readonly string ApiUrl;

        public RolesService(DBContext Context, IConfiguration Configuration, ISQLHelper SQLHelper,
            RoleManager<IdentityRole> RoleManager, SubscriptionDbContext subscriptionContext)
        {
            this.Context = Context;
            this.Configuration = Configuration;
            this.SQLHelper = SQLHelper;
            this.RoleManager = RoleManager;
            this.ConnectionString = Configuration.GetConnectionString("DBConnection");
            this.SubscriptionDB = Configuration.GetConnectionString("SubscriptionDB");
            this.ApiUrl = Configuration.GetSection("ApiUrl").Value;
            SubscriptionContext = subscriptionContext;
        }

        public List<PagePermissionModel> GetUserAuthorizedPages(string UserId)
        {
            var userRoles = SubscriptionContext.UserRoles.Where(r => r.UserId == UserId).ToList();
            var results = (from userRole in userRoles
                               //join rol in SubscriptionContext.Roles on userRole.RoleId equals rol.Id
                           join perm in Context.RolePermissions on userRole.RoleId equals perm.RoleId
                           join pAction in Context.PageActions on perm.PageActionId equals pAction.PageActionId
                           join ac in Context.RoleActions on pAction.ActionId equals ac.RoleActionId
                           join page in Context.Pages on pAction.PageId equals page.PageId
                           select new PagePermissionModel
                           {
                               PageId = page.PageId,
                               ParentId = page.DisplayOrder,
                               DisplayOrder = page.DisplayOrder,
                               ActionId = pAction.ActionId,
                               PageActionId = pAction.PageActionId,
                               HasChild = page.HasChild ?? false,
                               IsActive = page.IsActive,
                               IsChecked = true,
                               DisplayNameAR = page.DisplayNameAR,
                               DisplayNameEN = page.DisplayNameEN,
                               PageName = page.PageName,
                               //ParentName = page.ParentName,
                               Icon = page.Icon,
                               Route = page.Route,
                               GroupName = page.GroupName,
                               ActionName = ac.ActionName,
                           }).ToList();

            var groupedData = results.GroupBy(x => x.PageId);
            var data = new List<PagePermissionModel>();
            foreach (var group in groupedData)
            {
                var page = group.First();

                page.Actions = group
                            .Where(x => x.ActionId != null)
                            .GroupBy(x => new { x.ActionId, x.ActionName, x.IsChecked })
                            .Select(g => g.First())
                            .Select(x => new PageActionModel
                            {
                                ActionId = x.ActionId,
                                ActionName = x.ActionName,
                                IsChecked = (bool)x.IsChecked
                            })
                            .ToList();
                page.ActionId = null;
                page.PageActionId = null;
                page.ActionName = string.Empty;
                page.IsChecked = false;
                data.Add(page);
            }

            return data;
        }

        public List<ApplicationPageModel> GetSubscriberRolePages(string SubscriberId, string RoleId)
        {
            SqlParameter[] Params = new SqlParameter[2];
            Params[0] = new SqlParameter("@SubscriberId", SubscriberId);
            Params[1] = new SqlParameter("@RoleId", RoleId);
            var results = SQLHelper.SQLQuery<PagePermissionModel>("dbo.SP_GetSubscriberRolePages", ConnectionString, Params);

            var groupedApp = results.GroupBy(x => new { x.ApplicationId, x.ApplicationName })
                .Select(app => new ApplicationPageModel
                {
                    ApplicationName = app.Key.ApplicationName,
                    ApplicationId = app.Key.ApplicationId,
                    Pages = app.Where(page => page.PageId != null).GroupBy(x => new { x.PageId, x.ParentId })
                    .Select(f => new PagePermissionModel
                    {
                        ApplicationName = app.Key.ApplicationName,
                        ApplicationId = app.Key.ApplicationId,
                        PageId = f.Key.PageId,
                        ParentId = f.Key.ParentId,
                        DisplayNameAR = f.FirstOrDefault().DisplayNameAR,
                        DisplayNameEN = f.FirstOrDefault().DisplayNameEN,
                        PageName = f.FirstOrDefault().PageName,
                        DisplayOrder = f.FirstOrDefault().DisplayOrder,
                        IsSelected = f.FirstOrDefault().IsSelected,
                        IsChecked = f.Any(y => !string.IsNullOrEmpty(y.ActionName) && (bool)y.IsChecked),
                        PageLevel = f.FirstOrDefault().PageLevel,
                        SubPages = new List<PagePermissionModel>(),
                        Actions = f.Where(y => !string.IsNullOrEmpty(y.ActionName)).Select(x => new PageActionModel
                        {
                            ActionId = x.ActionId,
                            PageActionId = x.PageActionId,
                            ActionName = x.ActionName,
                            IsChecked = (bool)x.IsChecked,
                        }).ToList()
                    }).ToList()
                }).ToList();

            foreach (var app in groupedApp)
            {
                app.Pages = BuildRoleTree(app.Pages);
            }
            return groupedApp;
        }
        public List<PagePermissionModel> GetPermissionsByRole(string RoleName)
        {
            SqlParameter[] Params = new SqlParameter[1];
            Params[0] = new SqlParameter("@RoleName", (object)RoleName ?? DBNull.Value);
            var results = SQLHelper.SQLQuery<PagePermissionModel>("dbo.SP_GetPermissionsByRole_Test", ConnectionString, Params);

            var distinctPages = results.GroupBy(x => new { x.PageId, x.ParentId })
                .Select(f => new PagePermissionModel
                {
                    PageId = f.FirstOrDefault().PageId,
                    ParentId = f.FirstOrDefault().ParentId,
                    DisplayNameAR = f.FirstOrDefault().DisplayNameAR,
                    DisplayNameEN = f.FirstOrDefault().DisplayNameEN,
                    PageName = f.FirstOrDefault().PageName,
                    DisplayOrder = f.FirstOrDefault().DisplayOrder,
                    IsSelected = f.FirstOrDefault().IsSelected,
                    IsChecked = f.Any(y => !string.IsNullOrEmpty(y.ActionName) && (bool)y.IsChecked),
                    PageLevel = f.FirstOrDefault().PageLevel,
                    SubPages = new List<PagePermissionModel>(),
                    Actions = f.Where(y => !string.IsNullOrEmpty(y.ActionName)).Select(x => new PageActionModel
                    {
                        ActionId = x.ActionId,
                        PageActionId = x.PageActionId,
                        ActionName = x.ActionName,
                        IsChecked = (bool)x.IsChecked,
                    }).ToList()
                }).ToList();

            var roleTree = BuildRoleTree(distinctPages);

            //var groupedData = results.GroupBy(x => x.PageId);
            //var data = new List<PagePermissionModel>();
            //foreach (var page in roleTree)
            //{
            //    page.Actions = results.Where(x => x.PageId == page.PageId).Select(x => new PageActionModel
            //    {
            //        ActionId = x.ActionId,
            //        PageActionId = x.PageActionId,
            //        ActionName = x.ActionName,
            //        IsChecked = (bool)x.IsChecked,
            //    }).ToList();
            //}

            return roleTree;
        }

        public static List<PagePermissionModel> BuildRoleTree(List<PagePermissionModel> accounts)
        {
            var accountDict = accounts.ToDictionary(acc => acc.PageId);
            var rootAccounts = new List<PagePermissionModel>();

            foreach (var account in accounts)
            {
                if (account.ParentId == 0)
                {
                    // This is a root account, add it to the root list
                    rootAccounts.Add(account);
                }
                else if (accountDict.TryGetValue(account.ParentId.Value, out var parentAccount))
                {
                    // Add the account to its parent's Children list
                    parentAccount.SubPages.Add(account);
                }
            }

            return rootAccounts.ToList();
        }



        public ActionsResponseModel SaveSubscriberRolePages(string SubscriberId, string RoleId, List<int> PageActionIds)
        {
            var role = RoleManager.Roles.FirstOrDefault(r => r.Id == RoleId);
            if (role == null)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = "can't find this role!" };
            }
            var Roles = Context.RolePermissions.Where(a => a.RoleId == RoleId && a.SubscriberId == SubscriberId).ToList();
            Context.RolePermissions.RemoveRange(Roles);

            try
            {
                foreach (int pageActionId in PageActionIds)
                {
                    Context.RolePermissions.Add(new RolePermission
                    {
                        RoleId = RoleId,
                        PageActionId = pageActionId,
                        SubscriberId = SubscriberId
                    });
                }
                Context.SaveChanges();

                return new ActionsResponseModel { Message = "Saved successfully !" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = "Error!" };
            }
        }


        public bool CheckComponentPermission(string RoleName, string ComponentName)
        {
            var Component = Context.Pages.Where(a => a.PageName == ComponentName).FirstOrDefault();
            var role = RoleManager.FindByNameAsync(RoleName);

            if (Component == null)
                return false;

            var Permission = Context.RolePermissions.Where(a => a.RoleId == role.Result.Id && a.PageActionId == Component.PageId).FirstOrDefault();
            if (Permission != null)
                return true;
            else
                return false;
        }

        public DataTable GetSideMenuItemsByRole(string RoleName, string GroupName)
        {
            var Role = RoleManager.FindByNameAsync(RoleName);

            SqlParameter[] Params = new SqlParameter[2];

            Params[0] = new SqlParameter("@RoleId", (object)Role.Result.Id ?? DBNull.Value);
            Params[1] = new SqlParameter("@GroupName", (object)GroupName ?? DBNull.Value);

            var dt = SQLHelper.ExecuteDataTable("[dbo].[SP_GeSideMenuItemsByRoleAndGroup]", ConnectionString, Params);
            return dt;

            //var Components = (from role in Context.RolePermissions
            //                  join component in Context.Components on role.ComponentId equals component.ComponentId
            //                  where role.RoleId == Role.Result.Id && component.IsActive == true && component.GroupName == GroupName
            //                  select new
            //                  {
            //                      component
            //                  }).ToList();

            //var List = Components.Where(a => a.component.ParentId == 0).Select(x => new SideMenuModel
            //{
            //    Name = x.component.DisplayName,
            //    Icon = x.component.Icon,
            //    Route = x.component.Route,
            //    Id = x.component.ComponentId,
            //    SubItems = Context.Components.Where(y => y.ParentId == x.component.ComponentId)
            //            .Select(s => new SideMenuModel
            //            {
            //                Name = s.DisplayName,
            //                Icon = s.Icon,
            //                Id = s.ComponentId,
            //                Route = s.Route,
            //                SubItems = Context.Components.Where(z => z.ParentId == s.ComponentId).Select(ss => new SideMenuModel
            //                {
            //                    Name = ss.DisplayName,
            //                    Icon = ss.Icon,
            //                    Id = ss.ComponentId,
            //                    Route = ss.Route,
            //                    SubItems = new List<SideMenuModel>()
            //                }).ToList()
            //            }).ToList()
            //}).ToList();

            //return List;
        }

        public List<CustomerApplicationModel> GetCustomerApplications(string CustomerId)
        {
            SqlParameter[] Params = new SqlParameter[1];
            Params[0] = new SqlParameter("@CustomerId", CustomerId);

            var results = SQLHelper.SQLQuery<CustomerApplicationModel>("[dbo].[SP_GetCustomerApplications]", SubscriptionDB, Params);
            var apps = results.Select(x => new CustomerApplicationModel
            {
                ApplicationId = x.ApplicationId,
                ApplicationCode = x.ApplicationCode,
                ApplicationColor = x.ApplicationColor,
                ApplicationLogo = x.ApplicationLogo,
                ApplicationName = x.ApplicationName,
                ApplicationUrl = x.ApplicationUrl,
                DisplayOrder = x.DisplayOrder,
                RedirectUri = x.RedirectUri,
                Icon = Path.Combine(ApiUrl, "Logo", x.ApplicationLogo)
            }).ToList();


            return apps;
        }
    }
}
