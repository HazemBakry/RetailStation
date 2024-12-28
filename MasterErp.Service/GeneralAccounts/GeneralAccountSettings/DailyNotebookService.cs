using MasterErp.Entities.Common;
using MasterErp.Entities.Models;
using MasterErp.Interface.Common;
using MasterErp.Interface.GeneralAccounts.GeneralAccountSettings;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.GeneralAccounts.GeneralAccountSettings
{
    public class DailyNotebookService: IDailyNotebookService
    {
        private readonly DBContext Context;
        public DailyNotebookService(DBContext dBContext)
        {
            Context = dBContext;;
        }

        public List<DailyNotebook> GetDailyNotebookData()
        {
            var results = Context.DailyNotebooks.ToList();
            return results;
        }

        public ActionsResponseModel AddNewDailyNotebook(DailyNotebook Model)
        {
            try
            {
                var entity = Context.DailyNotebooks.FirstOrDefault(i => i.DailyNotebookName == Model.DailyNotebookName);
                if (entity != null)
                {
                    return new ActionsResponseModel
                    {
                        IsSuccess = false,
                        Message = "هذا الاسم موجود"
                    };
                }

                DailyNotebook notebookObj = new DailyNotebook();

                notebookObj.DailyNotebookName = Model.DailyNotebookName;
                notebookObj.Type = Model.Type;
                notebookObj.Code = Model.Code;
                notebookObj.VirtualAccount = Model.VirtualAccount;
                notebookObj.CreatedDate = DateTime.Now;
                notebookObj.CreatedBy = Model.CreatedBy;

                Context.DailyNotebooks.Add(notebookObj);
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

        public ActionsResponseModel EditDailyNotebook(DailyNotebook Model)
        {
            try
            {
                var entity = Context.DailyNotebooks.FirstOrDefault(x => x.DailyNotebookId == Model.DailyNotebookId);
                if (entity != null)
                {
                    entity.DailyNotebookName = Model.DailyNotebookName;
                    entity.Type = Model.Type;
                    entity.Code = Model.Code;
                    entity.VirtualAccount = Model.VirtualAccount;
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

        public ActionsResponseModel DeleteDailyNotebook(int DailyNotebookId)
        {
            try
            {
                var entity = Context.DailyNotebooks.FirstOrDefault(i => i.DailyNotebookId == DailyNotebookId);
                if (entity != null)
                {
                    Context.DailyNotebooks.Remove(entity);
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
