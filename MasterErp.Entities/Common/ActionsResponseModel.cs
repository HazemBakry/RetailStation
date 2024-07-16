using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Common
{
    public class ActionsResponseModel
    {
        public int Id { get; set; }
        public string Number { get; set; }
        public string URL { get; set; }
        public bool HasError { get; set; }
        public bool IsSuccess { get; set; }=true;
        public string Message { get; set; }
        public string ErrorMessage { get; set; }
        public int Status { get; set; }
    }
}
