using MasterErp.Entities.Common.Inventory.PurchasesRequests;
using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.Inventory;
using MasterErp.Entities.Models;
using MasterErp.Interface.Common;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MasterErp.Entities.Common.Finance.GeneralAccounts;
using MasterErp.Entities.DTOs.GeneralAccounts;
using Microsoft.EntityFrameworkCore;
using MasterErp.Entities.Common.Enums;
using MasterErp.Interface.GeneralAccounts;
using Microsoft.Data.SqlClient;
using MasterErp.Entities.DTOs.HR;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace MasterErp.Service.GeneralAccounts
{
    public class ReceiptLedgerService : IReceiptLedgerService
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

        public ReceiptLedgerService(DBContext dBContext, ISQLHelper iSQLHelper, IConfiguration _configuration)
        {
            Context = dBContext;
            SQLHelper = iSQLHelper;
            Configuration = _configuration;
        }

        public PagedResponseModel<ReceiptLedgerDTO> GetReceiptLedgersData(FilterModel model)
        {
            SqlParameter[] Params = new SqlParameter[2];
            Params[0] = new SqlParameter("@CurrentPage", (object)model.CurrentPage ?? DBNull.Value);
            Params[1] = new SqlParameter("@PageSize", (object)model.PageSize ?? DBNull.Value);

            var data = SQLHelper.SQLQuery<ReceiptLedgerDTO>("[Finance].[SP_GetPaymentReceipts_Summary]", ConnectionString, Params);

            var result = new PagedResponseModel<ReceiptLedgerDTO>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage

            };
            return result;
        }

        public ActionsResponseModel CreateNewReceiptLedger(ReceiptLedgerModel Model)
        {
            try
            {
                ReceiptLedger tbl = new ReceiptLedger();

                tbl.CreatedDate = DateTime.Now;
                tbl.CreatedBy = string.Empty;

                tbl.StartReceiptNumber = Model.StartReceiptNumber;
                tbl.ReceiptLedgerTypeId = Model.ReceiptLedgerTypeId;
                tbl.PeriodId = Model.PeriodId;
                tbl.OperationTypeId = Model.OperationTypeId;
                tbl.Code = Model.Code;
                tbl.IsActive = Model.IsActive;
                tbl.IsLocked = Model.IsLocked;
                tbl.NameAR = Model.NameAR;
                tbl.NameEN = Model.NameEN;
                tbl.Notes = Model.Notes;


                Context.ReceiptLedgers.Add(tbl);
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
