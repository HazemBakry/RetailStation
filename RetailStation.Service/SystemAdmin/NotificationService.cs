using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using RetailStation.Entities.Common;
using RetailStation.Entities.DTOs.Subscription;
using RetailStation.Entities.Models;
using RetailStation.Entities.Models.SystemAdmin;
using RetailStation.Interface.Common;
using RetailStation.Interface.SystemAdmin;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Service.SystemAdmin
{

    public class NotificationService : INotificationService
    {
        private readonly IConfiguration _configuration;
        private readonly string ConnectionString;
        private readonly DBContext _dBContext;
        private readonly ISharedFilterService _sharedFilterService;
        private readonly ISQLHelper _sQLHelper;

        public NotificationService(IConfiguration configuration, DBContext dBContext,
            ISharedFilterService sharedFilterService, ISQLHelper sQLHelper)
        {
            _configuration = configuration;
            _dBContext = dBContext;
            _sharedFilterService = sharedFilterService;
            _sQLHelper = sQLHelper;
            ConnectionString = _configuration.GetConnectionString("DBConnection");
        }

        public List<SubscriberDto> GetCustomers(string search, int take = 20)
        {
            return _dBContext.Subscribers.Select(x => new SubscriberDto
            {
                Email = x.Email,
                SubscriberId = x.SubscriberId,
                SubscriberName = x.SubscriberName
            }).ToList();

            //var query = _dBContext.Customers.AsQueryable();
            //if (!string.IsNullOrEmpty(search))
            //{
            //    query = query.Where(c => c.NameAR.Trim().Contains(search));
            //}
            //var result = await query
            //    .Where(a => !string.IsNullOrEmpty(a.NameAR.Trim()))
            //    .OrderBy(c => c.NameAR)
            //    .Take(take)
            //    .Select(c => new CustomerDTO
            //    {
            //        ID = c.CustomerId,
            //        Name = c.NameAR
            //    })
            //    .ToListAsync();

            //return result;
        }

        public DataTable GetNotificationsBySubscriberID(string subscriberID, FilterModel model)
        {
            DataTable dt = _sharedFilterService.MapFilterModelToDataTable(model?.FilterItems);
            SqlParameter[] Params =
            [
                new SqlParameter("@SubscriberID", (object)subscriberID ?? DBNull.Value),
                new SqlParameter("@CurrentPage", (object)model.CurrentPage ?? DBNull.Value),
                new SqlParameter("@PageSize", (object)model.PageSize ?? DBNull.Value),
                new SqlParameter("@FilterList", SqlDbType.Structured),
            ];
            Params[3].Value = dt;

            DataTable result = _sQLHelper.ExecuteDataTable("[dbo].[SP_GetNotificationsBySubscriberID]", ConnectionString, Params);
            return result;

        }


        public async Task<List<SubscriberDto>> GetRecipientsByNotificationID(string subscriberID, int notificationID)
        {
            var customers = new List<SubscriberDto>();
            try
            {
                customers = await _dBContext.NotificationRecipients
                              .Where(r => r.NotificationId == notificationID && r.Notification.SubscriberId == subscriberID)
                              .Select(r => new SubscriberDto { SubscriberId = r.SubscriberId, SubscriberName = r.Subscriber.SubscriberName, Email = r.Subscriber.Email })
                              .ToListAsync();
            }
            catch (Exception ex)
            {

                throw;
            }


            return customers;
        }

        public async Task<(int StatusCode, string Message)> SaveNotification(CreateNotificationDto dto, string subscriberID)
        {
            try
            {
                var notification = new Notification
                {
                    SubscriberId = subscriberID,
                    Subject = dto.title,
                    Content = dto.content,
                    StatusID = 1, //(int)NotificationStatus.Pending,
                    isActive = true,
                    Recipients = dto.subscriberIds.Select(id => new NotificationRecipient
                    {
                        SubscriberId = id
                    }).ToList()
                };

                _dBContext.Notifications.Add(notification);
                var result = await _dBContext.SaveChangesAsync();

                return result > 0 ? (200, "SUCCESS") : (100, "Error Occured During Save Notification");
            }
            catch (Exception ex)
            {

                return (100, "ERROR - " + ex.Message);
            }

        }

        public async Task<(int StatusCode, string Message)> UpdateNotification(CreateNotificationDto dto, string subscriberID)
        {
            try
            {
                var existingNotification = await _dBContext.Notifications
                                          .Include(n => n.Recipients)
                                          .FirstOrDefaultAsync(n => n.ID == dto.id && n.SubscriberId == subscriberID);

                if (existingNotification == null)
                    return (100, "Notification not found");

                // Update scalar properties
                existingNotification.Subject = dto.title;
                existingNotification.Content = dto.content;

                // Remove old recipients
                _dBContext.NotificationRecipients.RemoveRange(existingNotification.Recipients);

                // Add new recipients
                existingNotification.Recipients = dto.subscriberIds.Select(cid => new NotificationRecipient
                {
                    SubscriberId = cid,
                    // UserNotificationID = id // optional if EF tracks
                }).ToList();

                var result = await _dBContext.SaveChangesAsync();

                return result > 0 ? (200, "SUCCESS") : (100, "Error Occured During Update Notification");
            }
            catch (Exception ex)
            {

                return (100, "ERROR - " + ex.Message);
            }

        }

        public async Task<(int StatusCode, string Message)> UpdateNotificationStatus(int id, bool isActive, string subscriberID)
        {
            try
            {
                var existingNotification = await _dBContext.Notifications.FirstOrDefaultAsync(n => n.ID == id && n.SubscriberId == subscriberID);

                if (existingNotification == null)
                    return (100, "Notification not found");

                // Update scalar properties
                existingNotification.isActive = isActive;
                var result = await _dBContext.SaveChangesAsync();

                return result > 0 ? (200, "SUCCESS") : (100, "Error Occured During Update Notification");
            }
            catch (Exception ex)
            {

                return (100, "ERROR - " + ex.Message);
            }
        }
    }
}

