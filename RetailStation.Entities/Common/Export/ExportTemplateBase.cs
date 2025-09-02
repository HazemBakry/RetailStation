using RetailStation.Entities.Common.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Common.Export
{
    public class ExportTemplateBase
    {
        public string Name { get; set; }
        public string Username { get; set; }
        public string CustomerName { get; set; }
        public string TemplateName { get; set; }
        public string ReportName { get; set; }
        public ExcelExportStyle ExcelStyle { get; set; } = ExcelExportStyle.reportStyle; //set default value 
        public string SheetName { get; set; }
        public int FrozenRow { get; set; }
        public int FrozenColumn { get; set; }
        public string CustomerTemplateName { get; set; }


        public Dictionary<string, string> SubstitutionDictionary()
        {
            var parameter = new Dictionary<string, string>
            {
                {"TemplateName", TemplateName},
                {"ReportName", ReportName},
                {"Username", Username},
                {"CustomerName", CustomerName},
                {"Name", Name},
                {"FrozenRow", FrozenRow.ToString()},
                {"FrozenColumn", FrozenColumn.ToString()},
                {"SheetName", SheetName},
                {"ExcelStyle", ((int)ExcelStyle).ToString()},
                {"CustomerTemplateName", CustomerTemplateName},
            };
            return parameter;
        }
    }
}
