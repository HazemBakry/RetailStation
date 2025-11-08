using RetailStation.Entities.Common;
using RetailStation.Entities.Common.Lookups;
using RetailStation.Entities.Models;
using RetailStation.Interface.Common;
using RetailStation.Interface.Shared;
using RetailStation.Service.Common;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Service.Shared
{
    public class LookupService : ILookupService
    {
        private readonly DBContext Context;
        private readonly ISQLHelper SQLHelper;
        private readonly IConfiguration Configuration;
        private readonly IExportService _exportService;
        private readonly string ConnectionString;
        private readonly LookupsDbContext LookupsContext;
        public LookupService(DBContext dBContext, ISQLHelper ISQLHelper, IConfiguration _configuration, LookupsDbContext lookupsContext)
        {
            SQLHelper = ISQLHelper;
            Configuration = _configuration;
            ConnectionString = Configuration.GetConnectionString("LookupDB");
            LookupsContext = lookupsContext;
        }


    }
}
