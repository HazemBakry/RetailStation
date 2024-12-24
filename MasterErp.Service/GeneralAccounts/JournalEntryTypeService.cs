using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.GeneralAccounts;
using MasterErp.Entities.DTOs.GeneralAccounts;
using MasterErp.Entities.Models;
using MasterErp.Interface.Common;
using MasterErp.Interface.GeneralAccounts;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.GeneralAccounts
{
    public class JournalEntryTypeService : IJournalEntryTypeService
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

        public JournalEntryTypeService(DBContext dBContext, ISQLHelper iSQLHelper, IConfiguration _configuration)
        {
            Context = dBContext;
            SQLHelper = iSQLHelper;
            Configuration = _configuration;
        }

        public PagedResponseModel<JournalEntryType> GetJournalEntryTypesData(FilterModel Model)
        {
            int totalCount = Context.JournalEntryTypes.Count();

            int skip = (Model.CurrentPage - 1) * Model.PageSize;

            var data = Context.JournalEntryTypes
                .OrderByDescending(e => e.NameEN)
                .Skip(skip)
                .Take(Model.PageSize)
            .ToList();

            return new PagedResponseModel<JournalEntryType>
            {
                TotalCount = totalCount,
                Results = data,
                CurrentPage = Model.CurrentPage,
                PageSize = Model.PageSize
            };
        }



        public ActionsResponseModel CreateNewJournalEntryType(JournalEntryTypeModel Model)
        {
            try
            {
                JournalEntryType tbl = new JournalEntryType();

                tbl.CreateDate = DateTime.Now;
                tbl.CreatedBy = string.Empty;

                tbl.Code = Model.Code;
                tbl.IsActive = Model.IsActive;
                tbl.NameAR = Model.NameAR;
                tbl.NameEN = Model.NameEN;
                tbl.Notes = Model.Notes;

                Context.JournalEntryTypes.Add(tbl);
                Context.SaveChanges();

                return new ActionsResponseModel
                {
                    Status = 1,
                    Message = "تم الحفظ  بنجاح"
                };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    Status = 0,
                    Message = ex.Message
                };
            }
        }


    }
}
