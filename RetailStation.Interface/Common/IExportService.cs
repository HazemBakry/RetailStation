using RetailStation.Entities.Common.Enums;
using RetailStation.Entities.Common.Export;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Interface.Common
{
    public interface IExportService
    {
        string Export(ExportTemplateBase exportTemplateBase, DataTable data);
        string DownloadImporterTemplate(ExcelExportStyle Template);
    }
}
