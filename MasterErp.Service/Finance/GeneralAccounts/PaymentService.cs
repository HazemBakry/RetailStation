using MasterErp.Entities.Common;
using MasterErp.Entities.Models;
using MasterErp.Interface.Common;
using MasterErp.Interface.Finance.GeneralAccounts;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.Finance.GeneralAccounts
{
    public class PaymentService : IPaymentService
    {
        private readonly DBContext Context;
        private readonly ISQLHelper SQLHelper;
        private readonly IConfiguration Configuration;

        private string ConnectionString
        {
            get
            {
                return Configuration.GetConnectionString("DBConnection");
            }
        }

        public PaymentService(DBContext dBContext, ISQLHelper iSQLHelper, IConfiguration _configuration)
        {
            Context = dBContext;
            SQLHelper = iSQLHelper;
            Configuration = _configuration;
        }

        public List<PaymentReceipt> GetPaymentReceiptData()
        {
            return Context.PaymentReceipt.ToList();
        }

        public CreateModifyReturnsModel SaveNewPaymentReceipt(PaymentReceipt Model)
        {
            try
            {
                PaymentReceipt tbl = new PaymentReceipt();

                tbl.ReceiptNumber = (Context.PaymentReceipt.Count() > 0 ? Context.PaymentReceipt.Max(x => x.ReceiptNumber) + 1 : 1);
                tbl.ReceiptLedgerId = Model.ReceiptLedgerId;
                tbl.PaymentTypeId = Model.PaymentTypeId;
                tbl.ReleaseDate = Model.ReleaseDate;
                tbl.BenefitPerson= Model.BenefitPerson;
                tbl.Notes= Model.Notes;
                tbl.ChequeNumber= Model.ChequeNumber;
                tbl.MoneyAmount= Model.MoneyAmount;
                tbl.DocNumber= Model.DocNumber;
                tbl.AgencyTypeId= Model.AgencyTypeId;
                tbl.AgencyId= Model.AgencyId;
                tbl.AccountId= Model.AccountId;
                tbl.InsertDate = DateTime.Now;
                tbl.InsertUser = "";
                tbl.IsCancelled = false;
                tbl.IsLocked = false;


                Context.PaymentReceipt.Add(tbl);
                Context.SaveChanges();

                
                return new CreateModifyReturnsModel
                {
                    Status = 1,
                    Message = "Payment Receipt Created",
                    Id= tbl.ReceiptNumber
                };
            }
            catch (Exception ex)
            {
                return new CreateModifyReturnsModel
                {
                    Status = 0,
                    Message = ex.Message
                };
            }
        }

        public List<ReceiveReceipt> GetReceiveReceiptData()
        {
            return Context.ReceiveReceipt.ToList();
        }

        public CreateModifyReturnsModel SaveNewReceiveReceipt(ReceiveReceipt Model)
        {
            try
            {
                ReceiveReceipt tbl = new ReceiveReceipt();

                tbl.ReceiptNumber = (Context.ReceiveReceipt.Count() > 0 ? Context.ReceiveReceipt.Max(x => x.ReceiptNumber) + 1 : 1);
                tbl.ReceiptLedgerId = Model.ReceiptLedgerId;
                tbl.ReceiveTypeId = Model.ReceiveTypeId;
                tbl.ReleaseDate = Model.ReleaseDate;
                tbl.BenefitPerson = Model.BenefitPerson;
                tbl.Notes = Model.Notes;
                tbl.ChequeNumber = Model.ChequeNumber;
                tbl.MoneyAmount = Model.MoneyAmount;
                tbl.DocNumber = Model.DocNumber;
                tbl.AgencyTypeId = Model.AgencyTypeId;
                tbl.AgencyId = Model.AgencyId;
                tbl.AccountId = Model.AccountId;
                tbl.InsertDate = DateTime.Now;
                tbl.InsertUser = "";
                tbl.IsCancelled = false;
                tbl.IsLocked = false;


                Context.ReceiveReceipt.Add(tbl);
                Context.SaveChanges();


                return new CreateModifyReturnsModel
                {
                    Status = 1,
                    Message = "Payment Receipt Created",
                    Id = tbl.ReceiptNumber
                };
            }
            catch (Exception ex)
            {
                return new CreateModifyReturnsModel
                {
                    Status = 0,
                    Message = ex.Message
                };
            }
        }

    }
}
