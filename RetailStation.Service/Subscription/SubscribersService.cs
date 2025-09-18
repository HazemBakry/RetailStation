

using RetailStation.Interfaces.Subscription;
using RetailStation.Interface.Common;
using Microsoft.Extensions.Configuration;
using RetailStation.Entities.Common;
using RetailStation.Entities.DTOs.Subscription;
using RetailStation.Entities.Models;
using System.Threading.Tasks;
using System.Linq;
using RetailStation.Entities.Models.Subscription;
using System;
using System.Data.Entity;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;
using RetailStation.Entities.DTOs.Auth;
using System.IO;
using RetailStation.Entities.Common.Enums;
using RetailStation.Entities.DTOs.Website;
using RetailStation.Interface.Auth;
using Microsoft.AspNetCore.Mvc.RazorPages;
using RetailStation.Entities.Common.Lookups;

namespace RetailStation.Services.Subscription
{
    public class SubscribersService : ISubscribersService
    {
        private readonly ISQLHelper _sQLHelper;
        private readonly IConfiguration _configuration;
        private readonly DBContext Context;
        private readonly ISharedFilterService SharedFilterService;
        private readonly IAuthService AuthService;
        private readonly IFileService FileService;
        private readonly LookupsDbContext LookupsContext;
        private readonly string ConnectionString;
        public readonly string SubscribersFolderName;
        public SubscribersService(ISQLHelper sQLHelper, IConfiguration configuration, IFileService fileService, ISharedFilterService sharedFilterService, DBContext context, IAuthService authService, LookupsDbContext lookupsContext)
        {
            _sQLHelper = sQLHelper;
            _configuration = configuration;
            ConnectionString = _configuration.GetConnectionString("DBConnection");
            SubscribersFolderName = "SubscriberAttachments";
            FileService = fileService;
            SharedFilterService = sharedFilterService;
            Context = context;
            AuthService = authService;
            LookupsContext = lookupsContext;
        }
        public async Task<ActionsResponseModel> CreateNewSubscriber(SubscriberDto model)
        {
            try
            {
                if (Context.Subscribers.Any(t => t.SubscriberName == model.SubscriberName))
                    return new ActionsResponseModel
                    {
                        IsSuccess = false,
                        Message = "subscriber already exist (change name)"
                    };

                var subscriber = new SubscriberModel();

                subscriber.SubscriberId = Guid.NewGuid().ToString();
                subscriber.SubscriberName = model.SubscriberName;
                subscriber.Email = model.Email;
                //subscriber.ParentId = model.ParentId;
                subscriber.DomainName = model.DomainName;
                subscriber.SubscriberTypeId = (SubscriberType)model.SubscriberTypeId;
                subscriber.CreatedBy = model.CreatedBy;
                subscriber.CreatedDate = DateTime.Now;



                Context.Subscribers.Add(subscriber);
                var result = Context.SaveChanges();

                //if (model.SubscriberFiles != null)
                //{
                //    string subscriberDirectory = GetSubscribertDirectoryName(subscriber.SubscriberId);
                //    var uploadResponse = await FileService.UploadMultipleFilesAsync(model.SubscriberFiles, subscriberDirectory, FileType.Attachment);
                //    if (uploadResponse.IsUploaded)
                //    {
                //        subscriber.Image = uploadResponse.FilePath;
                //        Context.SaveChanges();
                //    }
                //}

                return new ActionsResponseModel { Message = "Subscriber Added Successfly !", Id = 0 };//subscriber.SubscriberId };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }


        public async Task<ActionsResponseModel> EditSubscriber(string SubscriberId, SubscriberDto model)
        {
            try
            {
                var subscriber =  Context.Subscribers.FirstOrDefault(i => i.SubscriberId == SubscriberId);
                if (subscriber != null)
                {

                    if (Context.Subscribers.Any(t => t.SubscriberName == model.SubscriberName && t.SubscriberId != SubscriberId))
                        return new ActionsResponseModel
                        {
                            IsSuccess = false,
                            Message = "subscriber already exist (change name)"
                        };


                    subscriber.SubscriberName = model.SubscriberName;
                    subscriber.Email = model.Email;
                    //subscriber.ParentId = model.ParentId;
                    subscriber.DomainName = model.DomainName;
                    subscriber.ModifiedBy = model.ModifiedBy;
                    subscriber.ModifiedDate = DateTime.Now;


                    //if (model.ImageFile != null)
                    //{
                    //    string subscriberDirectory = GetSubscribertDirectoryName(subscriber.SubscriberId);
                    //    var uploadResponse = await FileService.UploadFileAsync(model.ImageFile, subscriberDirectory, FileType.Image);
                    //    if (uploadResponse.IsUploaded)
                    //    {
                    //        subscriber.Image = uploadResponse.FilePath;
                    //    }


                    //}
                    Context.SaveChanges();


                    return new ActionsResponseModel { Message = "Subscriber Updated Successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "Subscriber not found" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }



        public List<SubscriberDto> GetAllSubscribers_Data(SearchFilterModel Model, string SubscriberId = "")
        {
            var Params = new SqlParameter[3];
            Params[0] = new SqlParameter("@PageSize", Model.PageSize);
            Params[1] = new SqlParameter("@CurrentPage", Model.CurrentPage);
            Params[2] = new SqlParameter("@SubscriberId", SubscriberId);
            var results = _sQLHelper.SQLQuery<SubscriberDto>("[dbo].[SP_GetAllSubscribers_Data]", ConnectionString, Params);
            return results;
        }
        public SubscriberDto GetSubscriberById(string SubscriberId)
        {
            SearchFilterModel Model = new SearchFilterModel();
            Model.CurrentPage = 1;
            Model.PageSize = 10;

            return GetAllSubscribers_Data(Model, SubscriberId).FirstOrDefault();
        }
        public List<SubscriberApplicationDto> GetSubscriberApplications(string SubscriberId)
        {
            var Params = new SqlParameter[1];
            Params[0] = new SqlParameter("@SubscriberId", SubscriberId);
            var results = _sQLHelper.SQLQuery<SubscriberApplicationDto>("[dbo].[SP_GetSubscriberApplications]", ConnectionString, Params);
            
            return results;
            //var Params = new SqlParameter[4];
            //Params[0] = new SqlParameter("@PageSize", Model.PageSize);
            //Params[1] = new SqlParameter("@CurrentPage", Model.CurrentPage);
            //Params[2] = new SqlParameter("@SearchText", Model.SearchText);
            //Params[3] = new SqlParameter("@SubscriberId", SubscriberId);
            //var results = _sQLHelper.SQLQuery<SubscriberProductModel>("[dbo].[SP_GetSubscriberProductsBySubscriberId]", ConnectionString, Params);
            //return results;
        }
        public ActionsResponseModel EditSubscriberApplications(string SubscriberId, List<SubscriberApplicationDto> ApplicationList)
        {
            try
            {
                var existingApplications = Context.SubscriberApplications
                                            .Where(i => i.SubscriberId == SubscriberId)
                                            .ToList();

                foreach (var application in ApplicationList)
                {
                    var existingApplication = existingApplications
                        .FirstOrDefault(e => e.ApplicationId == application.ApplicationId);

                    if (existingApplication != null)
                    {
                        // Update status for existing application
                        existingApplication.SubscriberStatusId = application.SubscriberStatusId;
                        existingApplication.StartDate = application.StartDate ?? DateTime.Now;
                        existingApplication.EndDate = application.EndDate ?? DateTime.Now.AddDays(365);
                        existingApplication.SubscriberCategoryId = application.SubscriberCategoryId;
                        existingApplication.IsActive = application.IsActive;
                    }
                    else
                    {
                        // Add new application if it doesn't exist
                        var newApplication = new SubscriberApplicationModel
                        {
                            SubscriberId = SubscriberId,
                            ApplicationId = application.ApplicationId,
                            SubscriberStatusId = application.SubscriberStatusId,
                            StartDate = application.StartDate ?? DateTime.Now,
                            EndDate = application.EndDate ?? DateTime.Now.AddDays(365),
                            SubscriberCategoryId = application.SubscriberCategoryId,
                            IsActive = application.IsActive,

                        };
                        Context.SubscriberApplications.Add(newApplication);
                    }
                }

                Context.SaveChanges();
                return new ActionsResponseModel { IsSuccess = true, Message = "Subscriber applications updated successfully!" };

            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }


        #region SubscribeRequests
        public ActionsResponseModel EditSubscribeRequest(string SubscribeRequestId, SubscribeRequestModel model)
        {
            var Item = Context.SubscribeRequests.Where(x => x.SubscribeRequestId == SubscribeRequestId).FirstOrDefault();

            if (Item != null)
            {
                Item.SubscriberName = model.SubscriberName;
                Item.Email = model.Email;
                Item.PhoneNumber = model.PhoneNumber;
                Item.SubscriberTypeId = model.SubscriberTypeId;
                Context.SaveChanges();
                return new ActionsResponseModel
                {
                    Message = "تم حفظ البيانات بنجاح"
                };
            }
            else
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Message = "يرجى اختبار المراد تعديلها"
                };
            }
        }
        public ActionsResponseModel DeleteSubscribeRequest(string SubscribeRequestId)
        {
            var item = Context.SubscribeRequests.FirstOrDefault(m => m.SubscribeRequestId == SubscribeRequestId);

            if (item != null)
            {
                Context.Remove(item);
                Context.SaveChanges();

                return new ActionsResponseModel
                {
                    Status = 1,
                    Message = "تم حذف البيانات بنجاح"
                };
            }
            else
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Message = "يرجى اختبار الوحدة المراد حذفها"
                };
            }
        }
        public List<SubscribeRequestModel> GetSubscribeRequests_Data(SearchFilterModel FilterModel)
        {
            var query = from sub in Context.SubscribeRequests
                        select new SubscribeRequestModel
                        {
                            SubscribeRequestId = sub.SubscribeRequestId,
                            SubscriberName = sub.SubscriberName,
                            SubscriberId = sub.SubscriberId,
                            Email = sub.Email,
                            PhoneNumber = sub.PhoneNumber,
                            SubscriberTypeId = sub.SubscriberTypeId,
                            RequestDate = sub.RequestDate,
                            WorkflowStatusId = sub.WorkflowStatusId,

                        };
            //var WorkflowStatus = LookupsContext.WorkflowStatus.ToList();

            int totalCount = query.Count();
            if (FilterModel.CurrentPage > 0 && FilterModel.PageSize > 0)
            {
                int skip = (FilterModel.CurrentPage - 1) * FilterModel.PageSize;
                query = query.Skip(skip).Take(FilterModel.PageSize);
            }

            var pagedResults = query.ToList();
            //results.ForEach(x => x.TotalCount = totalCount);
            var results = pagedResults.Select(x =>
            {
                //var workflowStatus = WorkflowStatus.FirstOrDefault(p => p.WorkflowStatusId == x.WorkflowStatusId);
                x.TotalCount = totalCount;
                //x.WorkflowStatusNameEN = workflowStatus?.NameEN;
                //x.WorkflowStatusNameAR = workflowStatus?.NameAR;
                return x;
            }).ToList();
            return results;
        }
        public ActionsResponseModel ApproveSubscribeRequest(string SubscribeRequestId, SubscriberRegistrationModel model)
        {
            var request = Context.SubscribeRequests.FirstOrDefault(m => m.SubscribeRequestId == SubscribeRequestId);
            
            if (request != null)
            {
                var response = AuthService.RegisterAsync(model).Result;
                //return new ActionsResponseModel
                //{
                //    Status = 1,
                //    Message = "تم الموافقة البيانات بنجاح"
                //};
                if(response.IsSuccess)
                {
                    request.WorkflowStatusId =(int) WorkflowStatus.Approved;
                    Context.SaveChanges();
                }
                return response;
            }
            else
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Message = "يرجى اختبار الطلب المراد الموافقة علية"
                };
            }
        }
        #endregion


        public string GetSubscribertDirectoryName(string SubscriberId)
        {
            string directory = string.Empty;

            directory = Path.Combine(SubscribersFolderName, SubscriberId);
            return directory;
        }
    }
}
