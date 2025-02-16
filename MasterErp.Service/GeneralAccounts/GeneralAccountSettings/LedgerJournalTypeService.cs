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
    public class LedgerJournalTypeService: ILedgerJournalTypeService
    {
        private readonly DBContext Context;
        public LedgerJournalTypeService(DBContext dBContext)
        {
            Context = dBContext;
        }

        public List<LedgerJournalType> GetLedgerJournalTypeData()
        {
            var results = Context.LedgerJournalTypes.ToList();
            return results;
        }

        public ActionsResponseModel AddNewLedgerJournalType(LedgerJournalType Model)
        {
            try
            {
                var entity = Context.LedgerJournalTypes.FirstOrDefault(i => i.NameAr == Model.NameAr);
                if (entity != null)
                {
                    return new ActionsResponseModel
                    {
                        IsSuccess = false,
                        Message = "هذا الاسم موجود"
                    };
                }

                LedgerJournalType LedgerObj = new LedgerJournalType();

                LedgerObj.NameAr = Model.NameAr;
                LedgerObj.CreatedDate = DateTime.Now;
                LedgerObj.CreatedBy = Model.CreatedBy;

                Context.LedgerJournalTypes.Add(LedgerObj);
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

        public ActionsResponseModel EditLedgerJournalType(LedgerJournalType Model)
        {
            try
            {
                var entity = Context.LedgerJournalTypes.FirstOrDefault(x => x.Id == Model.Id);
                if (entity != null)
                {
                    entity.NameAr = Model.NameAr;
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

        public ActionsResponseModel DeleteLedgerJournalType(int Id)
        {
            try
            {
                var entity = Context.LedgerJournalTypes.FirstOrDefault(i => i.Id == Id);
                if (entity != null)
                {
                    Context.LedgerJournalTypes.Remove(entity);
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
