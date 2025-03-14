using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.Purchases;
using MasterErp.Entities.Models;
using MasterErp.Entities.Models.Purchases;
using MasterErp.Interface.Purchase;
using Microsoft.CodeAnalysis;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MasterErp.Service.Purchase
{
    public class SuppliersService : ISuppliersService
    {
        private readonly DBContext Context;

        public SuppliersService(DBContext context)
        {
            Context = context;
        }

        public List<SupplierDto> GetSuppliersData(SearchFilterModel model, int? SupplierId = null)
        {

            var query = from supplier in Context.Suppliers
                        //join country in Context.Countries on supplier.CountryId equals country.CountryId into jT
                        //from country in jT.DefaultIfEmpty()
                        //join city in Context.Cities on supplier.CityId equals city.CityId into jT2
                        //from city in jT2.DefaultIfEmpty()
                        join region in Context.Regions on supplier.RegionId equals region.RegionId into jT3
                        from region in jT3.DefaultIfEmpty()
                        where !SupplierId.HasValue || supplier.SupplierId == SupplierId
                        select new SupplierDto
                        {
                            SupplierId = supplier.SupplierId,
                            Code = supplier.Code,
                            NameAR = supplier.NameAR,
                            NameEN = supplier.NameEN,
                            Phone = supplier.Phone,
                            Mobile = supplier.Mobile,
                            //CountryId = supplier.CountryId,
                            //CityId = supplier.CityId,
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

            int totalCount = query.Count();
            if (model.CurrentPage > 0 && model.PageSize > 0)
            {
                int skip = (model.CurrentPage - 1) * model.PageSize;
                query = query.Skip(skip).Take(model.PageSize);
            }

            var results = query.ToList();
            results.ForEach(x => x.TotalCount = totalCount);
            return results;
        }

        public SupplierDto GetSupplierDetailsById(SearchFilterModel model, int SupplierId)
        {
            var results = GetSuppliersData(model, SupplierId).FirstOrDefault();

            return results;
        }

        public ActionsResponseModel AddNewSupplier(SupplierDto model)
        {
            try
            {
                var supplier = new Supplier();

                supplier.Code = Context.Suppliers.Max(s => s.Code) ?? "1";
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
                supplier.BalanceType = model.BalanceType; //model.BalanceTypeId != null ? model.BalanceTypeId.ToString() : string.Empty;
                supplier.SupplierGroupId = model.SupplierGroupId;
                supplier.ContactPerson = model.ContactPerson;
                supplier.ContactMobile = model.ContactMobile;
                supplier.Notes = model.Notes;
                supplier.IsActive = true;
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
                    supplier.BalanceType = model.BalanceType; //model.BalanceTypeId != null ? model.BalanceTypeId.ToString() : string.Empty;
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
                var purchaseCount = Context.PurchaseInvoices.Where(x => x.SupplierId == SupplierId).ToList().Count();
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

        public List<SupplierDto> GetSuppliersByItemId(int ItemId)
        {
            var ItemSuppliers = (from item in Context.Items
                                 join itemSupplier in Context.ItemSuppliers on item.ItemId equals itemSupplier.ItemId
                                 join supplier in Context.Suppliers on itemSupplier.SupplierId equals supplier.SupplierId
                                 where item.ItemId == ItemId
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
                                 }).ToList();
            return ItemSuppliers;
        }

    }
}
