using RetailStation.Entities.Common;
using RetailStation.Entities.Models;
using RetailStation.Entities.Models.Purchases;
using Microsoft.CodeAnalysis;
using System;
using System.Collections.Generic;
using System.Linq;
using RetailStation.Interface.Operation;
using RetailStation.Entities.DTOs.Operation;

namespace RetailStation.Service.Inventory
{
    public class SuppliersService : ISuppliersService
    {
        private readonly DBContext Context;
        private readonly LookupsDbContext LookupsDbContext;

        public SuppliersService(DBContext context, LookupsDbContext lookupsDbContext)
        {
            Context = context;
            LookupsDbContext = lookupsDbContext;
        }

        public List<SupplierDto> GetSuppliers_Data(SearchFilterModel model, int? SupplierId = null)
        {
            var cities = LookupsDbContext.Cities.ToList();
            var contries = LookupsDbContext.Countries.ToList();
            var regions = LookupsDbContext.Regions.ToList();
            var payments = LookupsDbContext.PaymentMethods.ToList();
            var query = from supplier in Context.Suppliers
                        where !SupplierId.HasValue || supplier.SupplierId == SupplierId
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
                            DeliveryTime = supplier.DeliveryTime,
                            DeliveryCost = supplier.DeliveryCost,
                            PaymentMethodId = supplier.PaymentMethodId,
                            BalanceType = supplier.BalanceType,
                            SupplierGroupId = supplier.SupplierGroupId,
                            ContactPerson = supplier.ContactPerson,
                            ContactMobile = supplier.ContactMobile,
                            Notes = supplier.Notes,
                            SubscriberId = supplier.SubscriberId,
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
            foreach (var item in results)
            {
                var city = cities.FirstOrDefault(x=>x.CityId == item.CityId); 
                var country = contries.FirstOrDefault(x=>x.CountryId == item.CountryId); 
                var reigon = regions.FirstOrDefault(x=>x.RegionId == item.RegionId);
                var payment = payments.FirstOrDefault(x=>x.PaymentMethodId == item.PaymentMethodId);

                item.CountryName = country?.NameAR;
                item.CityName = reigon?.NameAR;
                item.RegionName = reigon?.NameAR;
                item.PaymentMethod = payment?.NameAR;
            }
            return results;
        }

        public SupplierDto GetSupplierDetailsById(SearchFilterModel model, int SupplierId)
        {
            var results = GetSuppliers_Data(model, SupplierId).FirstOrDefault();

            return results;
        }

        public ActionsResponseModel AddNewSupplier(SupplierDto model)
        {
            try
            {
                var supplier = new Supplier();

                supplier.Code = model.Code;//Context.Suppliers.Max(s => s.Code) ?? "1";
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
                supplier.DeliveryCost = model.DeliveryCost;
                supplier.DeliveryTime = model.DeliveryTime;
                supplier.PaymentMethodId = model.PaymentMethodId;
                supplier.BalanceType = model.BalanceType; //model.BalanceTypeId != null ? model.BalanceTypeId.ToString() : string.Empty;
                supplier.SupplierGroupId = model.SupplierGroupId;
                supplier.ContactPerson = model.ContactPerson;
                supplier.ContactMobile = model.ContactMobile;
                supplier.Notes = model.Notes;
                supplier.SubscriberId = model.SubscriberId;
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
                    supplier.DeliveryCost = model.DeliveryCost;
                    supplier.DeliveryTime = model.DeliveryTime;
                    supplier.PaymentMethodId = model.PaymentMethodId;
                    supplier.BalanceType = model.BalanceType; //model.BalanceTypeId != null ? model.BalanceTypeId.ToString() : string.Empty;
                    supplier.SupplierGroupId = model.SupplierGroupId;
                    supplier.ContactPerson = model.ContactPerson;
                    supplier.ContactMobile = model.ContactMobile;
                    supplier.Notes = model.Notes;
                    supplier.SubscriberId = model.SubscriberId;
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
                //var purchaseCount = Context.PurchaseInvoices.Where(x => x.SupplierId == SupplierId).ToList().Count();
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
