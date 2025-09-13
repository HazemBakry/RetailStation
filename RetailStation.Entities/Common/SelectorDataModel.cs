using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Common
{
    public class SelectorDataModel
    {
        public int Id { get; set; }
        public int Value => Id;
        public string Name { get; set; }
        public string Code { get; set; }
    }
    public class SelectorDataModel_Str
    {
        public string Id { get; set; }
        public string Value => Id;
        public string Name { get; set; }
        public string Code { get; set; }
    }
}
