using MasterErp.Entities.Models;
using MasterErp.Interface.Common;
using MasterErp.Interface.Finance.GeneralAccounts;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.Finance.GeneralAccounts
{
    public class JournalEntryService : IJournalEntryService
    {
        private readonly DBContext Context;
        private readonly ISQLHelper SQLHelper;
        private readonly IConfiguration Configuration;

        private string ConnectionString
        {
            get
            {
                return Configuration.GetConnectionString("DBConnection");
            }
        }

        public JournalEntryService(DBContext dBContext, ISQLHelper iSQLHelper, IConfiguration _configuration)
        {
            Context = dBContext;
            SQLHelper = iSQLHelper;
            Configuration = _configuration;
        }

        public List<JournalTemplate> GetSavedJournalTemplates()
        {
            var List = Context.JournalTemplates.ToList();
            return List;
        }

        public List<JournalTemplateDetails> GetAccountsByTemplateId(int templateId)
        {
            var List = Context.JournalTemplateDetail.Where(x => x.JournalTemplateId == templateId).ToList();
            return List;
        }
        
        public List<JournalEntryType> GetJournalEntryTypes()
        {
            var List = Context.JournalEntryTypes.Where(x => x.IsActive).ToList();
            return List;
        }
    }
}
