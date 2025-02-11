using MasterErp.Entities.Common;
using MasterErp.Entities.Models;
using MasterErp.Interface.Common;
using MasterErp.Interface.GeneralAccounts;
using MasterErp.Service.Common;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.GeneralAccounts
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

        public DataTable GetPaymentReceiptsSummary(FilterModel model)
        {
            return Context.PaymentReceipt.ToList().ToDataTable();
        }

        public ActionsResponseModel SavePaymentReceipt(PaymentReceipt Model)
        {
            try
            {
                PaymentReceipt tbl = new PaymentReceipt();

                tbl.ReceiptNumber = Context.PaymentReceipt.Count() > 0 ? Context.PaymentReceipt.Max(x => x.ReceiptNumber) + 1 : 1;
                tbl.ReceiptLedgerId = Model.ReceiptLedgerId;
                tbl.PaymentTypeId = Model.PaymentTypeId;
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

                Context.PaymentReceipt.Add(tbl);
                Context.SaveChanges();

                SaveNewEnrty(tbl);

                return new ActionsResponseModel
                {
                    Status = 1,
                    Message = "Payment Receipt Created",
                    Id = tbl.ReceiptNumber
                };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    Status = 0,
                    Message = ex.Message
                };
            }
        }

        public DataTable GetReceiveReceiptsSummary(FilterModel model)
        {
            return Context.ReceiveReceipt.ToList().ToDataTable();
        }

        public ActionsResponseModel SaveNewReceiveReceipt(ReceiveReceipt Model)
        {
            try
            {
                ReceiveReceipt tbl = new ReceiveReceipt();

                tbl.ReceiptNumber = Context.ReceiveReceipt.Count() > 0 ? Context.ReceiveReceipt.Max(x => x.ReceiptNumber) + 1 : 1;
                tbl.ReceiptLedgerId = Model.ReceiptLedgerId;
                tbl.BenefitPerson = Model.BenefitPerson;
                //tbl.SafeID = Int32.Parse(cmb_Safe.SelectedItem.Value.ToString());
                tbl.ReceiveTypeId = Model.ReceiveTypeId;
                tbl.ReleaseDate = Model.ReleaseDate;
                //tbl.CurrencyID = Int32.Parse(cmb_Currency.SelectedItem.Value.ToString());
                tbl.Notes = Model.Notes;
                tbl.DocNumber = Model.DocNumber;
                tbl.ChequeNumber = Model.ChequeNumber;
                tbl.MoneyAmount = Model.MoneyAmount;
                tbl.AgencyTypeId = Model.AgencyTypeId;
                tbl.AgencyId = Model.AgencyId;
                tbl.AccountId = Model.AccountId;
                tbl.InsertDate = DateTime.Now;
                tbl.InsertUser = "";
                tbl.IsCancelled = false;
                tbl.IsLocked = false;

                //tbl.PaymentTypeID = Int32.Parse(cmb_PaymentType.SelectedItem.Value.ToString());
                //tbl.LoanNumber = txt_ProductNumber.Text;
                //tbl.LedegerNumber = txt_LedgerNumber.Text;
                //tbl.PaidWithID = Int32.Parse(cmb_PaidWith.SelectedItem.Value.ToString());
                //tbl.JustmentNumber = txt_JustmentNumber.Text;


                //txt_ReceiptNumber.Text = Header_tbl.ReceitNumber.ToString();

                Context.ReceiveReceipt.Add(tbl);
                Context.SaveChanges();

                Model.ReceiveReceiptId = tbl.ReceiveReceiptId;
                //SaveNewEnrty(Model);

                return new ActionsResponseModel
                {
                    Status = 1,
                    Message = "Payment Receipt Created",
                    Id = tbl.ReceiptNumber
                };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    Status = 0,
                    Message = ex.Message
                };
            }
        }

        public void SaveNewEnrty(PaymentReceipt Model)
        {
            JournalEntry JournalHeader_tbl = new JournalEntry();

            //try
            //{
            //    JournalHeader_tbl.JournalEntryId = Context.JournalEntries.Max(x => x.JournalEntryId) + 1;
            //}
            //catch (Exception)
            //{
            //    JournalHeader_tbl.JournalEntryId = 1;
            //}

            JournalHeader_tbl.EntryNumber = Get_Entry_Number(Model.ReleaseDate);
            JournalHeader_tbl.DocNumber = "";// txt_ReceiptNumber.Text;
            JournalHeader_tbl.EntryDate = Model.ReleaseDate;
            JournalHeader_tbl.Description = Model.Notes;
            JournalHeader_tbl.Notes = Model.Notes;
            JournalHeader_tbl.IsLocked = false;
            JournalHeader_tbl.IsCancelled = false;
            JournalHeader_tbl.JournalTypeId = 3;
            JournalHeader_tbl.PeriodId = Context.ReceiptLedgers.Single(x => x.ReceiptLedgerId == Model.ReceiptLedgerId).PeriodId;
            JournalHeader_tbl.ActionTypeId = 4;
            JournalHeader_tbl.ActionId = Model.PaymentReceiptId;
            JournalHeader_tbl.CreateDate = DateTime.Now;
            JournalHeader_tbl.CreatedBy = "";

            Context.JournalEntries.Add(JournalHeader_tbl);
            Context.SaveChanges();


            int GeneralSupplierID = Context.AccountTrees.Single(x => x.AccountTypeId == 5).AccountId;

            //for (int i = 0; i < gvc.Rows.Count; i++)
            //{
            // Debit

            JournalEntryDetail JournalDetailsCredit_tbl = new JournalEntryDetail();

            //try
            //{
            //    JournalDetailsCredit_tbl.JournalEntryDetailId = Context.JournalEntryDetails.Max(x => x.JournalEntryDetailId) + 1;
            //}
            //catch (Exception)
            //{
            //    JournalDetailsCredit_tbl.JournalEntryDetailId = 1;
            //}

            JournalDetailsCredit_tbl.JournalEntryId = JournalHeader_tbl.JournalEntryId;

            if (Model.AgencyTypeId == 0)
            {
                JournalDetailsCredit_tbl.SupplierId = Model.AgencyTypeId;
                JournalDetailsCredit_tbl.AccountID = GeneralSupplierID;
            }
            else
            {
                JournalDetailsCredit_tbl.AccountID = Model.AccountId;
            }

            JournalDetailsCredit_tbl.Credit = 0;
            JournalDetailsCredit_tbl.Debit = Model.MoneyAmount;
            JournalDetailsCredit_tbl.CurrencyId = 1; // Int32.Parse(cmb_Currency.SelectedItem.Value.ToString());
            JournalDetailsCredit_tbl.Description = Model.Notes;

            Context.JournalEntryDetails.Add(JournalDetailsCredit_tbl);
            Context.SaveChanges();
            //}

            // Credit

            JournalEntryDetail JournalDetailsDebit_tbl = new JournalEntryDetail();

            //try
            //{
            //    JournalDetailsDebit_tbl.JournalEntryDetailId = Context.JournalEntryDetails.Max(x => x.JournalEntryDetailId) + 1;
            //}
            //catch (Exception)
            //{
            //    JournalDetailsDebit_tbl.JournalEntryDetailId = 1;
            //}

            JournalDetailsDebit_tbl.JournalEntryId = JournalHeader_tbl.JournalEntryId;
            JournalDetailsDebit_tbl.AccountID = 1; //Int32.Parse(cmb_Safe.SelectedItem.Value.ToString());
            JournalDetailsDebit_tbl.Credit = Model.MoneyAmount; //Double.Parse(((Label)gvc.FooterRow.FindControl("lbl_TotalAmount")).Text);
            JournalDetailsDebit_tbl.Debit = 0;
            JournalDetailsDebit_tbl.CurrencyId = 1; // Int32.Parse(cmb_Currency.SelectedItem.Value.ToString());
            JournalDetailsDebit_tbl.Description = Model.Notes; //((Label)gvc.Rows[0].FindControl("lbl_Notes_Row")).Text;

            Context.JournalEntryDetails.Add(JournalDetailsDebit_tbl);
            Context.SaveChanges();


            //#endregion

            //if (Session["Loan"] != null)
            //{
            //    int loan_id = int.Parse(Session["Loan"].ToString());
            //    var Loan = Context.Loans.Where(x => x.LoanID == loan_id).FirstOrDefault();

            //    Loan.IsActive = true;
            //    Context.SaveChanges();
            //}

            //Session["JournalEntry"] = JournalHeader_tbl.JournalID;
            //Session["Loan"] = null;

            //pnl_SuccessMessage.Visible = true;
            //pnl_SuccessMessage.BackColor = Color.FromArgb(51, 204, 51);
            //lbl_SuccessMessage.Text = "تم حفظ الايصال بنجاح";
        }

        private int Get_Entry_Number(DateTime releaseDate)
        {
            int month = releaseDate.Date.Month;
            int year = releaseDate.Date.Year;
            int ID = 1;

            try
            {
                ID = (Context.JournalEntries.Where(x => x.EntryDate.Month == month && x.EntryDate.Year == year).Max(x => x.EntryNumber) + 1);
            }
            catch (Exception)
            {
                ID = 1;
            }
            return ID;
        }
    }
}
