using Microsoft.Extensions.Configuration;
using RetailStation.Entities.Common;
using RetailStation.Entities.DTOs.SystemSettings;
using RetailStation.Entities.Models;
using RetailStation.Entities.Models.SystemAdmin;
using RetailStation.Interface.Common;
using RetailStation.Interface.SystemSetting;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Service.SystemSetting
{
    public class SystemSettingService: ISystemSettingService
    {
        private readonly DBContext Context;
        private readonly LookupsDbContext LookupsDbContext;
        private readonly ISQLHelper SQLHelper;
        private readonly IConfiguration Configuration;
        private readonly ISharedFilterService SharedFilterService;
        private readonly string ConnectionString;
        private readonly IExportService ExportService;
        private readonly IFileService _fileService;
        private readonly IDataImportService _dataImportService;
        public readonly string ItemsImagesFolder;
        public readonly string ApiUrl;

        public SystemSettingService(DBContext Context, ISQLHelper SQLHelper,
            IConfiguration Configuration, IExportService ExportService,
            ISharedFilterService sharedFilterService, LookupsDbContext lookupsDbContext, IFileService fileService, IDataImportService dataImportService)
        {
            this.Context = Context;
            this.SQLHelper = SQLHelper;
            this.Configuration = Configuration;
            ConnectionString = Configuration.GetConnectionString("DBConnection");
            this.ExportService = ExportService;
            SharedFilterService = sharedFilterService;
            LookupsDbContext = lookupsDbContext;
            _fileService = fileService;
            ItemsImagesFolder = "ItemsImages";
            _dataImportService = dataImportService;
            this.ApiUrl = Configuration.GetSection("ApiUrl").Value;

        }




        #region Regions

        public ActionsResponseModel AddRegion(RegionModel model)
        {
            try
            {
                if (Context.Regions.Any(x => x.NameEN == model.NameEN || x.NameAR == model.NameAR))
                    return new ActionsResponseModel
                    {
                        IsSuccess = false,
                        Message = "هذة الوحدة موجوده من قبل !"
                    };
                Context.Add(new Entities.Models.SystemAdmin.Region
                {
                    NameAR = model.NameAR,
                    NameEN = model.NameEN,
                    Code = model.Code,
                    IsActive = model.IsActive,
                    CountryId = model.CountryId,
                    CityId = model.CityId,
                    CreatedBy = string.Empty,
                    CreatedDate = DateTime.Now,
                });

                Context.SaveChanges();
                return new ActionsResponseModel
                {
                    Status = 1,
                    Message = "تم حفظ البيانات بنجاح"
                };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Message = ex.InnerException?.Message ?? ex.Message
                };
            }
        }
        public ActionsResponseModel EditRegion(int RegionId, RegionModel model)
        {
            var Item = Context.Regions.Where(x => x.RegionId == RegionId).FirstOrDefault();

            if (Item != null)
            {
                Item.NameAR = model.NameAR;
                Item.NameEN = model.NameEN;
                Item.Code = model.Code;
                Item.CountryId = model.CountryId;
                Item.CityId = model.CityId;
                Item.IsActive = model.IsActive;
                Item.ModifiedBy = string.Empty;

                Context.SaveChanges();
                return new ActionsResponseModel
                {
                    Status = 1,
                    Message = "تم حفظ البيانات بنجاح"
                };
            }
            else
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Message = "يرجى اختبار الوحدة المراد تعديلها"
                };
            }
        }
        public ActionsResponseModel DeleteRegion(int RegionId)
        {
            var item = Context.Regions.FirstOrDefault(m => m.RegionId == RegionId);

            if (item != null)
            {
                Context.Remove(item);
                Context.SaveChanges();

                return new ActionsResponseModel
                {
                    Status = 1,
                    Message = "تم حذف البيانات بنجاح"
                };
            }
            else
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Message = "يرجى اختبار الوحدة المراد حذفها"
                };
            }
        }
        public List<RegionModel> GetRegions_Data(SearchFilterModel FilterModel)
        {


            var query = from region in Context.Regions
                        select new RegionModel
                        {
                            NameEN = region.NameEN,
                            NameAR = region.NameAR,
                            RegionId = region.RegionId,
                            CityId = region.CityId,
                            CountryId = region.CountryId,
                            Code = region.Code,
                            IsActive = region.IsActive,
                            CreatedBy = region.CreatedBy,
                            CreatedDate = region.CreatedDate,
                            ModifiedBy = region.ModifiedBy,
                            ModifiedDate = region.ModifiedDate,
                        };

            int totalCount = query.Count();
            if (FilterModel.CurrentPage > 0 && FilterModel.PageSize > 0)
            {
                int skip = (FilterModel.CurrentPage - 1) * FilterModel.PageSize;
                query = query.Skip(skip).Take(FilterModel.PageSize);
            }

            var results = query.ToList();
            results.ForEach(x => x.TotalCount = totalCount);
            return results;
        }

        #endregion


        #region Cities

        public ActionsResponseModel AddCity(CityModel model)
        {
            try
            {
                if (Context.Cities.Any(x => x.NameEN == model.NameEN || x.NameAR == model.NameAR))
                    return new ActionsResponseModel
                    {
                        IsSuccess = false,
                        Message = "هذة الوحدة موجوده من قبل !"
                    };
                Context.Add(new City
                {
                    NameAR = model.NameAR,
                    NameEN = model.NameEN,
                    PostalCode = model.PostalCode,
                    IsActive = model.IsActive,
                    CountryId = model.CountryId,
                    CreatedBy = string.Empty,
                    CreatedDate = DateTime.Now,
                });

                Context.SaveChanges();
                return new ActionsResponseModel
                {
                    Status = 1,
                    Message = "تم حفظ البيانات بنجاح"
                };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Message = ex.InnerException?.Message ?? ex.Message
                };
            }
        }
        public ActionsResponseModel EditCity(int CityId, CityModel model)
        {
            var Item = Context.Cities.Where(x => x.CityId == CityId).FirstOrDefault();

            if (Item != null)
            {
                Item.NameAR = model.NameAR;
                Item.NameEN = model.NameEN;
                Item.PostalCode = model.PostalCode;
                Item.CountryId = model.CountryId;
                Item.IsActive = model.IsActive;
                Item.ModifiedBy = string.Empty;

                Context.SaveChanges();
                return new ActionsResponseModel
                {
                    Status = 1,
                    Message = "تم حفظ البيانات بنجاح"
                };
            }
            else
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Message = "يرجى اختبار الوحدة المراد تعديلها"
                };
            }
        }
        public ActionsResponseModel DeleteCity(int CityId)
        {
            var item = Context.Cities.FirstOrDefault(m => m.CityId == CityId);

            if (item != null)
            {
                Context.Remove(item);
                Context.SaveChanges();

                return new ActionsResponseModel
                {
                    Status = 1,
                    Message = "تم حذف البيانات بنجاح"
                };
            }
            else
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Message = "يرجى اختبار الوحدة المراد حذفها"
                };
            }
        }
        public List<CityModel> GetCities_Data(SearchFilterModel FilterModel)
        {


            var query = from city in Context.Cities
                        select new CityModel
                        {
                            NameEN = city.NameEN,
                            NameAR = city.NameAR,
                            CityId = city.CityId,
                            CountryId = city.CountryId,
                            PostalCode = city.PostalCode,
                            IsActive = city.IsActive,
                            CreatedBy = city.CreatedBy,
                            CreatedDate = city.CreatedDate,
                            ModifiedBy = city.ModifiedBy,
                            ModifiedDate = city.ModifiedDate,
                        };

            int totalCount = query.Count();
            if (FilterModel.CurrentPage > 0 && FilterModel.PageSize > 0)
            {
                int skip = (FilterModel.CurrentPage - 1) * FilterModel.PageSize;
                query = query.Skip(skip).Take(FilterModel.PageSize);
            }

            var results = query.ToList();
            results.ForEach(x => x.TotalCount = totalCount);
            return results;
        }

        #endregion

        #region Countries

        public ActionsResponseModel AddCountry(CountryModel model)
        {
            try
            {
                if (Context.Countries.Any(x => x.NameEN == model.NameEN || x.NameAR == model.NameAR))
                    return new ActionsResponseModel
                    {
                        IsSuccess = false,
                        Message = "هذة الوحدة موجوده من قبل !"
                    };
                Context.Add(new Country
                {
                    NameAR = model.NameAR,
                    NameEN = model.NameEN,
                    IsActive = model.IsActive,
                    CreatedBy = string.Empty,
                    CreatedDate = DateTime.Now,
                });

                Context.SaveChanges();
                return new ActionsResponseModel
                {
                    Status = 1,
                    Message = "تم حفظ البيانات بنجاح"
                };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Message = ex.InnerException?.Message ?? ex.Message
                };
            }
        }
        public ActionsResponseModel EditCountry(int CountryId, CountryModel model)
        {
            var Item = Context.Countries.Where(x => x.CountryId == CountryId).FirstOrDefault();

            if (Item != null)
            {
                Item.NameAR = model.NameAR;
                Item.NameEN = model.NameEN;
                Item.IsActive = model.IsActive;
                Item.ModifiedBy = string.Empty;

                Context.SaveChanges();
                return new ActionsResponseModel
                {
                    Status = 1,
                    Message = "تم حفظ البيانات بنجاح"
                };
            }
            else
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Message = "يرجى اختبار الوحدة المراد تعديلها"
                };
            }
        }
        public ActionsResponseModel DeleteCountry(int CountryId)
        {
            var item = Context.Countries.FirstOrDefault(m => m.CountryId == CountryId);

            if (item != null)
            {
                Context.Remove(item);
                Context.SaveChanges();

                return new ActionsResponseModel
                {
                    Status = 1,
                    Message = "تم حذف البيانات بنجاح"
                };
            }
            else
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Message = "يرجى اختبار الوحدة المراد حذفها"
                };
            }
        }
        public List<CountryModel> GetCountries_Data(SearchFilterModel FilterModel)
        {


            var query = from country in Context.Countries
                        select new CountryModel
                        {
                            NameEN = country.NameEN,
                            NameAR = country.NameAR,
                            CountryId = country.CountryId,
                            IsActive = country.IsActive,
                            CreatedBy = country.CreatedBy,
                            CreatedDate = country.CreatedDate,
                            ModifiedBy = country.ModifiedBy,
                            ModifiedDate = country.ModifiedDate,
                        };

            int totalCount = query.Count();
            if (FilterModel.CurrentPage > 0 && FilterModel.PageSize > 0)
            {
                int skip = (FilterModel.CurrentPage - 1) * FilterModel.PageSize;
                query = query.Skip(skip).Take(FilterModel.PageSize);
            }

            var results = query.ToList();
            results.ForEach(x => x.TotalCount = totalCount);
            return results;
        }

        #endregion
    }
}
