using MasterErp.Entities.Common;
using MasterErp.Entities.Models;
using MasterErp.Interface.Common;
using MasterErp.Interface.GeneralAccounts.Customers;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.GeneralAccounts.Customers
{
    public class CustomerService : ICustomerService
    {
        private readonly DBContext Context;
        private readonly ISQLHelper SQLHelper;
        private readonly IConfiguration Configuration;
        private readonly string ConnectionString;
        public CustomerService(DBContext dBContext, ISQLHelper sQLHelper, IConfiguration configuration)
        {
            Context = dBContext;
            SQLHelper = sQLHelper;
            Configuration = configuration;
            ConnectionString = Configuration.GetConnectionString("DBConnection");
        }

        public DataTable GetCustomerData(FilterModel model)
        {
            SqlParameter[] param = new SqlParameter[2];
            param[0] = new SqlParameter("@CurrentPage", (object)model.CurrentPage ?? DBNull.Value);
            param[1] = new SqlParameter("@PageSize", (object)model.PageSize ?? DBNull.Value);
            var dt = SQLHelper.ExecuteDataTable("[dbo].[SP_GetCustomerData]", param, ConnectionString);
            return dt;
        }

        public ActionsResponseModel AddNewCustomer(Customer Model)
        {
            try
            {
                Customer custObj = new Customer();

                custObj.NameAR = Model.NameAR;
                custObj.NameEN = Model.NameEN;
                custObj.Phone = Model.Phone;
                custObj.Mobile = Model.Mobile;
                custObj.CountryId = Model.CountryId;
                custObj.CityId = Model.CityId;
                custObj.RegionId = Model.RegionId;
                custObj.Address = Model.Address;
                custObj.Notes = Model.Notes;
                custObj.IsActive = true;
                custObj.CreatedDate = DateTime.Now;
                custObj.CreatedBy = Model.CreatedBy;

                Context.Customers.Add(custObj);
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

        public ActionsResponseModel EditCustomer(Customer Model)
        {
            try
            {
                var entity = Context.Customers.FirstOrDefault(x => x.CustomerId == Model.CustomerId);
                if (entity != null)
                {
                    entity.NameAR = Model.NameAR;
                    entity.NameEN = Model.NameEN;
                    entity.Phone = Model.Phone;
                    entity.Mobile = Model.Mobile;
                    entity.CountryId = Model.CountryId;
                    entity.CityId = Model.CityId;
                    entity.RegionId = Model.RegionId;
                    entity.Address = Model.Address;
                    entity.Notes = Model.Notes;
                    entity.IsActive = true;
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

        public ActionsResponseModel DeleteCustomer(int CustomerId)
        {
            try
            {
                var entity = Context.Customers.FirstOrDefault(i => i.CustomerId == CustomerId);
                if (entity != null)
                {
                    Context.Customers.Remove(entity);
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
