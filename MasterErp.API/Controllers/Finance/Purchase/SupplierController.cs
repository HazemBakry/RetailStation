using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.Purchases;
using MasterErp.Entities.Models;
using MasterErp.Interface.Finance.Purchase;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace MasterErp.API.Controllers.Finance.Purchase
{
    [Route("api/[controller]")]
    [ApiController]
    public class SupplierController : Controller
    {
        private readonly DBContext Context;

        public SupplierController(DBContext dBContext)
        {
            Context = dBContext;
        }

        [HttpGet]
        [Route("GetSuppliersData")]
        public List<Supplier> GetSuppliersData()
        {
            return Context.Suppliers.Where(x => x.IsActive).ToList();
        }

        [HttpPost]
        [Route("CreateNewSupplier")]
        public (int StatusCode, string Message) CreateNewSupplier(Supplier model)
        {
            try
            {
                Context.Add(new Supplier
                {
                    Code = model.Code,
                    NameAR = model.NameAR,
                    NameEN = model.NameEN,
                    Phone = model.Phone,
                    Mobile = model.Mobile,
                    Address = model.Address,
                    BeginningBalance = model.BeginningBalance,
                    BalanceType = model.BalanceType,
                    GroupId = model.GroupId,
                    ContactPerson = model.ContactPerson,
                    ContactMobile = model.ContactMobile,
                    Notes = model.Notes,
                    IsActive = true,
                    InsertUser = model.InsertUser,
                    InsertDate = DateTime.Now
                });

                Context.SaveChanges();
                return (200, "SUCCESS");
            }
            catch (Exception Ex)
            {
                return (100, "Fail - " + Ex.Message);
            }
        }

        [HttpPost]
        [Route("EditSupplier")]
        public (int StatusCode, string Message) EditSupplier(Supplier model)
        {
            try
            {
                Context.Update(model);
                Context.SaveChanges();

                return (200, "SUCCESS");
            }
            catch (Exception Ex)
            {
                return (100, "ERROR - " + Ex.Message);
            }
        }

        [HttpGet]
        [Route("DeleteSupplier")]
        public (int StatusCode, string Message) DeleteSupplier(int supplierId)
        {
            var driver = Context.Suppliers.FirstOrDefault(m => m.SupplierId == supplierId);

            if (driver == null)
            {
                return (100, "Supplier Not Found");
            }
            else
            {
                Context.Remove(driver);
                Context.SaveChanges();

                return (200, "Supplier Removed Successfully");
            }
        }

    }
}
