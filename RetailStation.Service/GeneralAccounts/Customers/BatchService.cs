using RetailStation.Entities.Common;
using RetailStation.Entities.Models;
using RetailStation.Entities.Models.Finance;
using RetailStation.Interface.Common;
using RetailStation.Interface.GeneralAccounts.Customers;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Service.GeneralAccounts.Customers
{
    public class BatchService: IBatchService
    {
        private readonly DBContext Context;
        private readonly ISQLHelper SQLHelper;
        private readonly IConfiguration Configuration;
        private readonly string ConnectionString;
        public BatchService(DBContext dBContext, ISQLHelper sQLHelper, IConfiguration configuration)
        {
            Context = dBContext;
            SQLHelper = sQLHelper;
            Configuration = configuration;
            ConnectionString = Configuration.GetConnectionString("DBConnection");
        }

        public DataTable GetBatchData(FilterModel model)
        {
            SqlParameter[] param = new SqlParameter[2];
            param[0] = new SqlParameter("@CurrentPage", (object)model.CurrentPage ?? DBNull.Value);
            param[1] = new SqlParameter("@PageSize", (object)model.PageSize ?? DBNull.Value);
            var dt = SQLHelper.ExecuteDataTable("[dbo].[SP_GetBatchData]", param, ConnectionString);
            return dt;
        }

        public ActionsResponseModel AddNewBatch(Batch Model)
        {
            try
            {
                Batch batchObj = new Batch();

                batchObj.NameAr = Model.NameAr;
                batchObj.BatchType = Model.BatchType;
                batchObj.CustomerId = Model.CustomerId;
                batchObj.Amount = Model.Amount;
                batchObj.InsertDate = Model.InsertDate;
                batchObj.LeadgerJournalId = Model.LeadgerJournalId;
                batchObj.PaymentMethod = Model.PaymentMethod;
                batchObj.CreatedDate = DateTime.Now;
                batchObj.CreatedBy = Model.CreatedBy;

                Context.Batches.Add(batchObj);
                Context.SaveChanges();


                return new ActionsResponseModel
                {
                    Message = "تم الحفظ  بنجاح"
                };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Message = ex.Message
                };
            }
        }

        public ActionsResponseModel EditBatch(Batch Model)
        {
            try
            {
                var entity = Context.Batches.FirstOrDefault(x => x.BatchId == Model.BatchId);
                if (entity != null)
                {
                    entity.NameAr = Model.NameAr;
                    entity.BatchType = Model.BatchType;
                    entity.CustomerId = Model.CustomerId;
                    entity.Amount = Model.Amount;
                    entity.InsertDate = Model.InsertDate;
                    entity.LeadgerJournalId = Model.LeadgerJournalId;
                    entity.PaymentMethod = Model.PaymentMethod;
                    entity.ModifiedDate = DateTime.Now;
                    entity.ModifiedBy = Model.ModifiedBy;
                }

                Context.SaveChanges();
                return new ActionsResponseModel
                {
                    Message = "تم التعديل  بنجاح"
                };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Message = ex.Message
                };
            }
        }

        public ActionsResponseModel DeleteBatch(int BatchId)
        {
            try
            {
                var entity = Context.Batches.FirstOrDefault(i => i.BatchId == BatchId);
                if (entity != null)
                {
                    Context.Batches.Remove(entity);
                    Context.SaveChanges();
                    return new ActionsResponseModel
                    {
                        Message = "تم الحذف  بنجاح"
                    };
                }
                else
                    return new ActionsResponseModel
                    {
                        IsSuccess = false,
                        Message = "لقد حدث خطأ"
                    };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Message = ex.Message
                };
            }

        }
    }
}
