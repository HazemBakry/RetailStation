using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    public class Bank
    {
		public int BankID { get; set; }
		public string Code { get; set; }
		public string Name { get; set; }
		public string PhoneNumber { get; set; }
		public string StreetAddress { get; set; }
		public string ContactPerson { get; set; }
		public int LastUser { get; set; }
		public DateTime LastUpdated { get; set; }
	}
}
