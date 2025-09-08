using RetailStation.Entities.Models;
using RetailStation.Entities.Models.Auth;
using RetailStation.Entities.Models.Subscription;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using RetailStation.Entities.Models.Subscription;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RetailStation.Entities.Models.Global;
using RetailStation.Entities.Common.Finance;
using RetailStation.Entities.Models.DataImport;
using RetailStation.Entities.Models.Finance;
using RetailStation.Entities.Models.HR;
using RetailStation.Entities.Models.Inventory;
using RetailStation.Entities.Models.Lookups;
using RetailStation.Entities.Models.Purchases;
using RetailStation.Entities.Models.Operation;

namespace RetailStation.Entities.Models
{
    public class DBContext: DbContext
    {
        private readonly IConfiguration Configuration;

        public DBContext(IConfiguration _configuration)
        {
            Configuration = _configuration;
        }

        public DBContext(DbContextOptions<DbContext> options)
           : base(options)
        {

        }

        //Elassal


        public DbSet<Customer> Customers { get; set; }

        public DbSet<Page> Pages { get; set; }
        public DbSet<RoleAction> RoleActions { get; set; }
        public DbSet<PageAction> PageActions { get; set; }
        public DbSet<RolePermission> RolePermissions { get; set; }

        public DbSet<ApplicationModel> Applications { get; set; }
        public DbSet<SubscriberApplicationModel> SubscriberApplications { get; set; }
        public DbSet<SubscriberModel> Subscribers { get; set; }
        #region Lookups
        public DbSet<Branch> Branches { get; set; }



        #region Depricated
        #region HR

        public DbSet<Employee> Employees { get; set; }
        public DbSet<Attendance> Attendance { get; set; }
        public DbSet<EmployeeVerification> EmployeeVerifications { get; set; }
        public DbSet<EmployeeAttachment> EmployeeAttachments { get; set; }
        public DbSet<Contract> Contracts { get; set; }
        public DbSet<ContractDetail> ContractDetails { get; set; }
        public DbSet<OverTime> OverTime { get; set; }
        public DbSet<Penalty> Penalties { get; set; }
        public DbSet<PenaltyType> PenaltyTypes { get; set; }
        public DbSet<MonthlySalary> MonthlySalary { get; set; }
        public DbSet<MonthlySalaryDetails> MonthlySalaryDetails { get; set; }
        public DbSet<EmployeeWeeklyShift> EmployeeWeeklyShifts { get; set; }
        public DbSet<EmployeeStatus> EmployeeStatus { get; set; }


        #endregion

        #region Global

        public DbSet<OrderStatus> OrderStatus { get; set; }


        #endregion

        public DbSet<Currency> Currency { get; set; }
        public DbSet<Bank> Banks { get; set; }
        public DbSet<Religion> Religions { get; set; }
        public DbSet<SocialStatus> SocialStatus { get; set; }

        public DbSet<ItemLookups> ItemLookups { get; set; }
        public DbSet<ItemLookupDetails> ItemLookupDetails { get; set; }
        public DbSet<Job> Jobs { get; set; }
        public DbSet<Region> Regions { get; set; }

        public DbSet<Nationality> Nationalities { get; set; }

        public DbSet<FinancialPeriod> FinancialPeriods { get; set; }
        public DbSet<PassportIssuePlace> PassportIssuePlaces { get; set; }
        public DbSet<PurchaseInvoice> PurchaseInvoices { get; set; }
        public DbSet<PurchaseInvoiceDetails> PurchaseInvoiceDetails { get; set; }
        public DbSet<PurchaseOrder> PurchaseOrders { get; set; }
        public DbSet<PurchaseOrderDetails> PurchaseOrderDetails { get; set; }
        public DbSet<PurchaseQuotation> PurchaseQuotations { get; set; }
        public DbSet<PurchaseQuotationDetails> PurchaseQuotationDetails { get; set; }
        public DbSet<SalesInvoice> SalesInvoices { get; set; }
        public DbSet<SalesInvoiceDetails> SalesInvoiceDetails { get; set; }
        public DbSet<Sponsor> Sponsors { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<SickLeave> SickLeaves { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<SupplierGroup> SupplierGroups { get; set; }
        public DbSet<Unit> Units { get; set; }
        public DbSet<Vacation> Vacations { get; set; }

        public DbSet<Deduct> Deducts { get; set; }
        public DbSet<DeductType> DeductTypes { get; set; }
        public DbSet<EmployeeCareer> EmployeeCareers { get; set; }
        public DbSet<WorkStatus> WorkStatus { get; set; }
        public DbSet<LoansPayment> LoansPayment { get; set; }
        public DbSet<Loan> Loans { get; set; }
        public DbSet<LoanType> LoanTypes { get; set; }
        public DbSet<EmployeeAdvance> EmployeeAdvances { get; set; }
        public DbSet<AdvancePayment> AdvancePayments { get; set; }
        public DbSet<AdvanceType> AdvanceTypes { get; set; }
        public DbSet<Store> Stores { get; set; }
        public DbSet<PaymentTerm> PaymentTerms { get; set; }
        public DbSet<PaymentTermDetails> PaymentTermDetails { get; set; }
        public DbSet<TaxCalculation> TaxCalculations { get; set; }
        public DbSet<DailyNotebook> DailyNotebooks { get; set; }
        public DbSet<AssetsForm> AssetsForms { get; set; }
        public DbSet<Loan> LoansForms { get; set; }
        public DbSet<Batch> Batches { get; set; }
        public DbSet<VerifiedAttendanceSummary> VerifiedAttendanceSummary { get; set; }
        public DbSet<EmployeeDue> EmployeeDues { get; set; }
        public DbSet<EmployeeFinancialCustody> EmployeeFinancialCustody { get; set; }





        #region Inventory

        public DbSet<ItemSupplier> ItemSuppliers { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<ItemCategory> ItemCategories { get; set; }
        public DbSet<MaterialReceipt> MaterialReceipts { get; set; }
        public DbSet<MaterialReceiptDetails> MaterialReceiptDetails { get; set; }
        public DbSet<DeliveryNote> DeliveryNotes { get; set; }
        public DbSet<DeliveryNoteDetails> DeliveryNoteDetails { get; set; }
        public DbSet<MaterialIssue> MaterialIssues { get; set; }
        public DbSet<MaterialIssueDetails> MaterialIssueDetails { get; set; }
        public DbSet<MaterialRequest> MaterialRequests { get; set; }
        public DbSet<MaterialRequestDetails> MaterialRequestDetails { get; set; }


        #endregion

        #region Finance

        public DbSet<AccountTree> AccountTrees { get; set; }
        public DbSet<CostCenterTree> CostCenterTree { get; set; }
        public DbSet<JournalEntry> JournalEntries { get; set; }
        public DbSet<JournalEntryDetail> JournalEntryDetails { get; set; }
        public DbSet<JournalTemplate> JournalTemplates { get; set; }
        public DbSet<JournalTemplateDetails> JournalTemplateDetails { get; set; }
        public DbSet<LedgerJournalType> LedgerJournalTypes { get; set; }

        public DbSet<PaymentOrder> PaymentOrders { get; set; }
        public DbSet<PaymentReceipt> PaymentReceipts { get; set; }
        public DbSet<ReceiveReceipt> ReceiveReceipts { get; set; }
        public DbSet<ReceiptLedger> ReceiptLedgers { get; set; }
        public DbSet<AccountOpeningBalance> AccountOpeningBalance { get; set; }

        #endregion

        #region Purchase

        public DbSet<PurchaseReturns> PurchaseReturns { get; set; }
        public DbSet<PurchaseReturnsDetails> PurchaseReturnsDetails { get; set; }
        public DbSet<PurchaseInvoiceType> PurchaseInvoiceTypes { get; set; }
        public DbSet<PurchaseRequest> PurchaseRequests { get; set; }
        public DbSet<PurchaseRequestDetails> PurchaseRequestDetails { get; set; }
        public DbSet<SupplierReturnsVoucher> SupplierReturnsVouchers { get; set; }
        public DbSet<SupplierReturnsVoucherDetails> SupplierReturnsVoucherDetails { get; set; }

        #endregion

        #region Sales


        #endregion

        #region DataImport
        public DbSet<ImporterModel> Importers { get; set; }
        public DbSet<ImporterColumnModel> ImporterColumns { get; set; }
        #endregion

        #endregion

        //public DbSet<Country> Countries { get; set; }
        //public DbSet<City> Cities { get; set; }
        //public DbSet<Region> Regions { get; set; }

        #endregion
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                string connString = this.Configuration.GetConnectionString("DBConnection");
                optionsBuilder.UseSqlServer(connString);
                optionsBuilder.EnableSensitiveDataLogging();
            }
        }
    }
}
