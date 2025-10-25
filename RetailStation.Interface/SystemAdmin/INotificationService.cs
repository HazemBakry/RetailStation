using RetailStation.Entities.Common;
using RetailStation.Entities.DTOs.Subscription;
using RetailStation.Entities.Models.SystemAdmin;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Interface.SystemAdmin
{
    public interface INotificationService
    {
        List<SubscriberDto> GetCustomers(string? search, int take = 20);
        DataTable GetNotificationsBySubscriberID(string subscriberID, FilterModel model);
        Task<List<SubscriberDto>> GetRecipientsByNotificationID(string subscriberID, int notificationID);
        Task<(int StatusCode, string Message)> SaveNotification(CreateNotificationDto dto, string subscriberID);
        Task<(int StatusCode, string Message)> UpdateNotification(CreateNotificationDto dto, string subscriberID);
        Task<(int StatusCode, string Message)> UpdateNotificationStatus(int id, bool isActive, string subscriberID);
    }
}

