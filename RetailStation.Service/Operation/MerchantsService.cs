using Microsoft.CodeAnalysis;
using RetailStation.Entities.Common;
using RetailStation.Entities.DTOs.Operation;
using RetailStation.Entities.Models;
using RetailStation.Entities.Models.Operation;
using RetailStation.Entities.Models.Purchases;
using RetailStation.Interface.Common;
using RetailStation.Interface.Operation;
using RetailStation.Service.Common;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace RetailStation.Service.Operation
{
    public class MerchantsService : IMerchantsService
    {
        private readonly DBContext Context;
        private readonly LookupsDbContext LookupsDbContext;
        private readonly IFileService FileService;
        public readonly string UserImagesFolder;


        public MerchantsService(DBContext context, LookupsDbContext lookupsDbContext, IFileService fileService)
        {
            Context = context;
            LookupsDbContext = lookupsDbContext;
            this.FileService = fileService;
            UserImagesFolder = "UserImages";
        }

        public List<MerchantModel> GetMerchants_Data(SearchFilterModel model, int? MerchantId = null)
        {
            var cities = Context.Cities.ToList();
            var contries = Context.Countries.ToList();
            var regions = Context.Regions.ToList();
            var payments = LookupsDbContext.PaymentMethods.ToList();
            var query = from merchant in Context.Merchants
                        where !MerchantId.HasValue || merchant.MerchantId == MerchantId
                        select new MerchantModel
                        {
                            MerchantId = merchant.MerchantId,
                            Code = merchant.Code,
                            NameAR = merchant.NameAR,
                            NameEN = merchant.NameEN,
                            Phone = merchant.Phone,
                            Mobile = merchant.Mobile,
                            Email = merchant.Email,
                            RegionId = merchant.RegionId,
                            Address = merchant.Address,
                            CommercialRegister = merchant.CommercialRegister,
                            BankAccountNumber = merchant.BankAccountNumber,
                            BrandName = merchant.BrandName,
                            TaxNumber = merchant.TaxNumber,
                            DeliveryTime = merchant.DeliveryTime,
                            DeliveryCost = merchant.DeliveryCost,
                            PaymentMethodId = merchant.PaymentMethodId,
                            ContactPerson = merchant.ContactPerson,
                            ContactMobile = merchant.ContactMobile,
                            Notes = merchant.Notes,
                            IsActive = merchant.IsActive,
                            ImageUrl = FileService.GetFileDownloadUrl(Path.Combine(UserImagesFolder, merchant.ImageUrl ?? "")),
                            CreatedBy = merchant.CreatedBy,
                            CreatedDate = merchant.CreatedDate,
                            ModifiedBy = merchant.ModifiedBy,
                            ModifiedDate = merchant.ModifiedDate,
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
                var city = cities.FirstOrDefault(x => x.CityId == item.CityId);
                var country = contries.FirstOrDefault(x => x.CountryId == item.CountryId);
                var reigon = regions.FirstOrDefault(x => x.RegionId == item.RegionId);
                var payment = payments.FirstOrDefault(x => x.PaymentMethodId == item.PaymentMethodId);

                item.CountryName = country?.NameAR;
                item.CityName = reigon?.NameAR;
                item.RegionName = reigon?.NameAR;
                item.PaymentMethod = payment?.NameAR;
            }
            return results;
        }

        public MerchantModel GetMerchantDetailsById(int MerchantId)
        {
            var results = GetMerchants_Data(new SearchFilterModel(), MerchantId).FirstOrDefault();

            return results;
        }

        public ActionsResponseModel AddNewMerchant(MerchantModel model)
        {
            try
            {
                var merchant = new Merchant();

                merchant.Code = model.Code;
                merchant.NameAR = model.NameAR;
                merchant.NameEN = model.NameEN;
                merchant.Phone = model.Phone;
                merchant.Mobile = model.Mobile;
                merchant.Email = model.Email;
                merchant.RegionId = model.RegionId;
                merchant.Address = model.Address;
                merchant.CommercialRegister = model.CommercialRegister;
                merchant.TaxNumber = model.TaxNumber;
                merchant.BankAccountNumber = model.BankAccountNumber;
                merchant.BrandName = model.BrandName;
                merchant.DeliveryCost = model.DeliveryCost;
                merchant.DeliveryTime = model.DeliveryTime;
                merchant.PaymentMethodId = model.PaymentMethodId;
                merchant.Rate = model.Rate;
                merchant.ContactPerson = model.ContactPerson;
                merchant.ContactMobile = model.ContactMobile;
                merchant.Notes = model.Notes;
                merchant.IsActive = true;
                merchant.CreatedBy = model.CreatedBy;
                merchant.CreatedDate = DateTime.Now;

                Context.Merchants.Add(merchant);
                var result = Context.SaveChanges();

                return new ActionsResponseModel { Message = "Merchant Added Successfly !", Id = merchant.MerchantId };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }

        public async Task<ActionsResponseModel> EditMerchantAsync(int MerchantId, MerchantModel model)
        {
            try
            {
                var merchant = Context.Merchants.FirstOrDefault(i => i.MerchantId == MerchantId);
                if (merchant != null)
                {
                    merchant.Code = model.Code;
                    merchant.NameAR = model.NameAR;
                    merchant.NameEN = model.NameEN;
                    merchant.Phone = model.Phone;
                    merchant.Mobile = model.Mobile;
                    merchant.Email = model.Email;
                    merchant.RegionId = model.RegionId;
                    merchant.Address = model.Address;
                    merchant.CommercialRegister = model.CommercialRegister;
                    merchant.TaxNumber = model.TaxNumber;
                    merchant.BankAccountNumber = model.BankAccountNumber;
                    merchant.BrandName = model.BrandName;
                    merchant.DeliveryCost = model.DeliveryCost;
                    merchant.DeliveryTime = model.DeliveryTime;
                    merchant.PaymentMethodId = model.PaymentMethodId;
                    merchant.Rate = model.Rate;
                    merchant.ContactPerson = model.ContactPerson;
                    merchant.ContactMobile = model.ContactMobile;
                    merchant.Notes = model.Notes;
                    merchant.IsActive = merchant.IsActive;
                    merchant.ModifiedBy = model.ModifiedBy;
                    merchant.ModifiedDate = DateTime.Now;

                    if (model.Image != null)
                    {
                        var uploadResponse = await FileService.UploadFileAsync(model.Image, UserImagesFolder, FileType.Image);
                        if (uploadResponse.IsUploaded)
                        {
                            merchant.ImageUrl = uploadResponse.FilePath;
                        }
                        else
                        {
                            return new ActionsResponseModel { Message = uploadResponse.Message, IsSuccess = false };
                        }
                    }

                    Context.SaveChanges();

                    return new ActionsResponseModel { Message = "Merchant Updated Successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "Merchant not found" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }

        public ActionsResponseModel DeleteMerchant(int MerchantId)
        {
            try
            {
                var merchant = Context.Merchants.FirstOrDefault(i => i.MerchantId == MerchantId);
                //var purchaseCount = Context.PurchaseInvoices.Where(x => x.MerchantId == MerchantId).ToList().Count();
                if (merchant != null)
                {
                    Context.Remove(merchant);
                    Context.SaveChanges();
                    return new ActionsResponseModel { Message = "Merchant deleted successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "Merchant not found" }; ;
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }


    }
}
