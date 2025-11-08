using RetailStation.Entities.Common.Lookups;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace RetailStation.Entities.Models
{

    public class LookupsDbContext : DbContext
    {
        private readonly IConfiguration Configuration;

        public LookupsDbContext(IConfiguration _configuration)
        {
            Configuration = _configuration;
        }

        public LookupsDbContext(DbContextOptions<DbContext> options)
           : base(options)
        {

        }


        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                string connString = this.Configuration.GetConnectionString("LookupDB");
                optionsBuilder.UseSqlServer(connString);
                optionsBuilder.EnableSensitiveDataLogging();
            }
        }

        public DbSet<JournalType> JournalTypes { get; set; }
        public DbSet<LedgerType> LedgerTypes { get; set; }
        public DbSet<PaymentType> PaymentTypes { get; set; }
        public DbSet<PaymentMethod> PaymentMethods { get; set; }
        public DbSet<ReceiptType> ReceiptTypes { get; set; }
        public DbSet<Bank> Banks { get; set; }
        public DbSet<IqamaIssuePlace> IqamaIssuePlaces { get; set; }
        public DbSet<VacationType> VacationTypes { get; set; }

    }
}

