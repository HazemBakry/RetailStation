using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
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

        public DbSet<Employee> Employee { get; set; }
        public DbSet<Nationality> Nationality { get; set; }
        public DbSet<Sponsor> Sponsor { get; set; }
        public DbSet<IqamaIssuePlace> IqamaIssuePlace { get; set; }
        public DbSet<PassportIssuePlace> PassportIssuePlace { get; set; }
        public DbSet<IqamaJob> IqamaJob { get; set; }
        public DbSet<Job> Job { get; set; }
        public DbSet<Branch> Branch { get; set; }
        public DbSet<Bank> Bank { get; set; }
        public DbSet<EmployeeContract> EmployeeContract { get; set; }

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
