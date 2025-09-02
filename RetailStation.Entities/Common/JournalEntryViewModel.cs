
namespace RetailStation.Entities.Common
{
    public class JournalEntryViewModel
    {
        public int AccountID { get; set; }
        public string AccountName { get; set; }
        public string AccountNumber { get; set; }
        public double Debit { get; set; }
        public double Credit { get; set; }
        public double PreDebit { get; set; }
        public double PreCredit { get; set; }
        public double TotalDebit { get; set; }
        public double TotalCredit { get; set; }
        public double NetDebit { get; set; }
        public double NetCredit { get; set; }

    }
}
