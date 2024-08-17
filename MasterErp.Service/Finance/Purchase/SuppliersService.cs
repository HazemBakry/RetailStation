using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.HR;
using MasterErp.Entities.DTOs.Purchases;
using MasterErp.Entities.Models;
using MasterErp.Entities.Models.HR;
using MasterErp.Entities.Models.HR.Employee;
using MasterErp.Interface.Finance.Purchase;
using Microsoft.CodeAnalysis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.Finance.Purchase
{
    public class SuppliersService : ISuppliersService
    {
        private readonly DBContext Context;

        public SuppliersService(DBContext context)
        {
            Context = context;
        }

        public List<SupplierDto> GetAllSuppliers(int? SupplierId=null)
        {
          
            var query = from supplier in Context.Suppliers
                        join country in Context.Countries on supplier.CountryId equals country.CountryId into jT from country in jT.DefaultIfEmpty()
                        join city in Context.Cities on supplier.CityId equals city.CityId into jT2 from city in jT2.DefaultIfEmpty()
                        join region in Context.Regions on supplier.RegionId equals region.RegionId into jT3 from region in jT3.DefaultIfEmpty()
                        where (!SupplierId.HasValue || supplier.SupplierId == SupplierId)
                        select new SupplierDto
                        {
                            SupplierId = supplier.SupplierId,
                            Code = supplier.Code,
                            NameAR = supplier.NameAR,
                            NameEN = supplier.NameEN,
                            Phone = supplier.Phone,
                            Mobile = supplier.Mobile,
                            CountryId = supplier.CountryId,
                            CityId = supplier.CityId,
                            RegionId = supplier.RegionId,
                            Address = supplier.Address,
                            CommercialRegister = supplier.CommercialRegister,
                            TaxNumber = supplier.TaxNumber,
                            BeginningBalance = supplier.BeginningBalance,
                            BalanceType = supplier.BalanceType,
                            SupplierGroupId = supplier.SupplierGroupId,
                            ContactPerson = supplier.ContactPerson,
                            ContactMobile = supplier.ContactMobile,
                            Notes = supplier.Notes,
                            IsActive = supplier.IsActive,
                            CreatedBy = supplier.CreatedBy,
                            CreatedDate = supplier.CreatedDate,
                            ModifiedBy = supplier.ModifiedBy,
                            ModifiedDate = supplier.ModifiedDate,
                        };

            //int totalCount = query.Count();
            //if (SearchModel.CurrentPage > 0 && SearchModel.PageSize > 0)
            //{
            //    int skip = (SearchModel.CurrentPage - 1) * SearchModel.PageSize;
            //    query = query.Skip(skip).Take(SearchModel.PageSize);
            //}

            var results = query.ToList();
            //results.ForEach(x => x.TotalCount = totalCount);
            return results;
        }

        public SupplierDto GetSupplierById(int SupplierId)
        {
            var results = GetAllSuppliers(SupplierId).FirstOrDefault();

            return results;
        }

        public ActionsResponseModel AddNewSupplier(SupplierDto model)
        {

            try
            {
                var supplier = new Supplier();

                supplier.Code = Context.Suppliers.Max(s=>s.Code) ?? "1";
                supplier.NameAR = model.NameAR;
                supplier.NameEN = model.NameEN;
                supplier.Phone = model.Phone;
                supplier.Mobile = model.Mobile;
                supplier.CountryId = model.CountryId;
                supplier.CityId = model.CityId;
                supplier.RegionId = model.RegionId;
                supplier.Address = model.Address;
                supplier.CommercialRegister = model.CommercialRegister;
                supplier.TaxNumber = model.TaxNumber;
                supplier.BeginningBalance = model.BeginningBalance;
                supplier.BalanceType = model.BalanceTypeId !=null? model.BalanceTypeId.ToString() : string.Empty;
                supplier.SupplierGroupId = model.SupplierGroupId;
                supplier.ContactPerson = model.ContactPerson;
                supplier.ContactMobile = model.ContactMobile;
                supplier.Notes = model.Notes;
                supplier.IsActive =true;
                supplier.CreatedBy = model.CreatedBy;
                supplier.CreatedDate = DateTime.Now;

                Context.Suppliers.Add(supplier);
                var result = Context.SaveChanges();
                

                return new ActionsResponseModel { Message = "Supplier Added Successfly !" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }

        public ActionsResponseModel EditSupplier(int SupplierId, SupplierDto model)
        {

            try
            {
                var supplier = Context.Suppliers.FirstOrDefault(i => i.SupplierId == model.SupplierId);
                if (supplier != null)
                {
                    //supplier.Code = model.Code;
                    supplier.NameAR = model.NameAR;
                    supplier.NameEN = model.NameEN;
                    supplier.Phone = model.Phone;
                    supplier.Mobile = model.Mobile;
                    supplier.CountryId = model.CountryId;
                    supplier.CityId = model.CityId;
                    supplier.RegionId = model.RegionId;
                    supplier.Address = model.Address;
                    supplier.CommercialRegister = model.CommercialRegister;
                    supplier.TaxNumber = model.TaxNumber;
                    supplier.BeginningBalance = model.BeginningBalance;
                    supplier.BalanceType = model.BalanceTypeId != null ? model.BalanceTypeId.ToString() : string.Empty;
                    supplier.SupplierGroupId = model.SupplierGroupId;
                    supplier.ContactPerson = model.ContactPerson;
                    supplier.ContactMobile = model.ContactMobile;
                    supplier.Notes = model.Notes;
                    supplier.IsActive = supplier.IsActive;
                    supplier.ModifiedBy = model.ModifiedBy;
                    supplier.ModifiedDate = DateTime.Now;

                    Context.SaveChanges();


                    return new ActionsResponseModel { Message = "Supplier Updated Successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "Supplier not found" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }


        public ActionsResponseModel DeleteSupplier(int SupplierId)
        {

            try
            {
                var supplier = Context.Suppliers.FirstOrDefault(i => i.SupplierId == SupplierId);
                if (supplier != null)
                {
                    Context.Remove(supplier);
                    Context.SaveChanges();
                    return new ActionsResponseModel { Message = "Supplier deleted successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "Supplier not found" }; ;
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }
    }
}
