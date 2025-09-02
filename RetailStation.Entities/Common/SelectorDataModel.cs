using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Common
{
    public class SelectorDataModel
    {
        public int Id { get; set; }
        public int Value => Id;
        public string Name { get; set; }
        public string Code { get; set; }
    }
}
