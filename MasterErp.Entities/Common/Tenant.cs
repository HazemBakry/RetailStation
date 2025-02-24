using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    public class Tenant
    {
        public string SubscriberId { get; set; }
        public string Name { get; set; }
        public string ConnectionString { get; set; }
    }



    public interface ITenantService
    {
        string GetConnectionString(string tenantId);
    }


    public class TenantService : ITenantService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IConfiguration _configuration;

        public TenantService(IHttpContextAccessor httpContextAccessor, IConfiguration configuration)
        {
            _httpContextAccessor = httpContextAccessor;
            _configuration = configuration;
        }

        //public string GetConnectionString(string tenantId)
        //{
        //    //var tenantId = _httpContextAccessor.HttpContext?.Request.Headers["TenantId"].ToString();

        //    if (string.IsNullOrEmpty(tenantId))
        //    {
        //        return _configuration.GetConnectionString("DBConnection");
        //    }

        //    // Example: Get connection from database (In-memory lookup for now)
        //    var tenants = new List<Tenant>
        //    {
        //        new Tenant { Id = 1, Name = "Tenant1", ConnectionString = "Server=server1;Database=DB1;User Id=user;Password=pass;" },
        //        new Tenant { Id = 2, Name = "Tenant2", ConnectionString = "Server=server2;Database=DB2;User Id=user;Password=pass;" }
        //    };

        //    var tenant = tenants.FirstOrDefault(t => t.Name.Equals(tenantId, StringComparison.OrdinalIgnoreCase));

        //    return tenant?.ConnectionString ?? _configuration.GetConnectionString("DefaultConnection");
        //}

        public string GetConnectionString(string subscriberId)
        {
            var tenants = new List<Tenant>
            {
                new Tenant {
                    SubscriberId = "46FA6FEE-897F-41F8-95AA-F008666E1BAA",
                    Name = "Mishwar",
                    ConnectionString = "Data Source=37.76.224.205; Initial Catalog=MasterERP_Test;User ID=sa;Password=zA0s5g?5!;TrustServerCertificate=True"
                },
                new Tenant {
                    SubscriberId = "2",
                    Name = "Tenant2",
                    ConnectionString = "Server=server2;Database=DB2;User Id=user;Password=pass;" }
            };

            var tenant = tenants.FirstOrDefault(t => t.SubscriberId.Equals(subscriberId, StringComparison.OrdinalIgnoreCase));
            return tenant?.ConnectionString ?? throw new Exception("Tenant not found");
        }
    }
}
