using MasterErp.Entities.Common.Enums;
using MasterErp.Entities.Common.Export;
using MasterErp.Interface.Common;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Hosting.Internal;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.SqlClient.Server;
using Microsoft.Extensions.Configuration;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.Common
{
    public class ExportService : IExportService
    {

        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IHostingEnvironment _hostingEnvironment;

        public ExportService( IHttpContextAccessor contextAccessor, IHostingEnvironment hostingEnvironment, IConfiguration configuration)
        {
            _configuration = configuration;
            _hostingEnvironment = hostingEnvironment;
            _contextAccessor = contextAccessor;
            //this.configuration = configuration;
        }

        public string Export(ExportTemplateBase exportTemplateBase, DataTable data)
        {
            string format = ".xlsx";
            var localPath = GetLocalPath(exportTemplateBase.TemplateName, format);

            Export(localPath, data, _hostingEnvironment, exportTemplateBase.SubstitutionDictionary());
            //if (_hostingEnvironment.EnvironmentName== "Development")
            //{
            //    return localPath;
            //}
            return GetDownloadUrl(Path.GetFileName(localPath));
        }



        public string GetDownloadUrl(string FileName)
        {
            string serverPath = _configuration["ExportFilesURL"];
            var request = _contextAccessor.HttpContext.Request;
            return $"{request.Scheme}://{request.Host}{request.PathBase}/{serverPath.Replace("wwwroot/", "").Replace("\\", "/")}/{FileName}";
            //string URL = string.Format("{0}://{1}{2}/{3}", request.Scheme, request.Host, serverPath, FileName);
            //return URL;
        }
        private string GetLocalPath(string fileTitle, string extension)
        {
            //string url=string.Format(@"ExportFiles\")
            string path = Path.Combine(_hostingEnvironment.WebRootPath, @"ExportFiles");
            string FileName = $"{fileTitle}_{DateTime.Now:yyyyMMddHHmmssfff}{extension}";
            string WEBurl = Path.Combine(_hostingEnvironment.WebRootPath, @"ExportFiles\", FileName);
            return WEBurl;
        }
        private string GetTemplateLocalPath(string fileTitle, string extension)
        {
            string TemplatePath = Path.Combine(_hostingEnvironment.WebRootPath, @"Template\", $"{fileTitle}{extension}");
            return TemplatePath;
        }
        public string DownloadImporterTemplate(ExcelExportStyle Template)
        {
            string TemplateStyle = Enum.GetName(typeof(ExcelExportStyle), Template) + ".xlsx";
            string URL = "";
            try
            {
                var request = _contextAccessor.HttpContext.Request;
                URL = string.Format("{0}://{1}{2}/{3}", request.Scheme, request.Host, @"/Template", TemplateStyle);

                //URL = Path.Combine(_hostingEnvironment.WebRootPath, @"Template\", TemplateStyle);
                
                return URL;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public void Export(string fullPath, DataTable data, IHostingEnvironment hostingEnvironment, Dictionary<string, string> substitutionValue = null)
        {
            int TemplateStyleNumValue = int.Parse(substitutionValue["ExcelStyle"]);
            string TemplateStyle = Enum.GetName(typeof(ExcelExportStyle), TemplateStyleNumValue) + ".xlsx";
            int startrow = 1;
            try
            {
                var temp = new FileInfo(Path.Combine(hostingEnvironment.WebRootPath, @"Template\", TemplateStyle));
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                using (var package = new ExcelPackage(new FileInfo(fullPath), temp))
                {
                    var sheet = package.Workbook.Worksheets["Sheet1"];
                    switch (TemplateStyleNumValue)
                    {
                        case 1:
                            WriteHeader(sheet, data.Columns.Cast<DataColumn>().Select(e => e.ColumnName).ToList());
                            for (var i = 0; i < data.Rows.Count; ++i)
                            {
                                WriteRow(sheet, data.Rows[i].ItemArray, startrow);
                                startrow++;
                            }
                            //SetTemplateValues(ref sheet, substitutionValue);
                            break;
                        case 2:

                            //sheet.Cells[4, 1].LoadFromDataTable(data, true);
                            //SetTemplateValuesReportStyle(ref sheet, substitutionValue);
                            sheet.Cells[startrow, 1].LoadFromDataTable(data, true);
                            //SetTemplateValuesReportStyle(ref sheet, substitutionValue);
                            break;
                    }
                    SetFrozenPane(ref sheet, substitutionValue);
                    package.Save();
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        private void WriteHeader(ExcelWorksheet worksheet, IList<string> headers, int? startRow = null)
        {
            try
            {
                for (var i = 0; i < headers.Count; i++)
                {
                    var headerValue = headers[i];
                    var headerCell = worksheet.Cells[startRow ?? 5, i + 1];
                    headerCell.Value = headerValue;
                    setHeaderWidth(ref headerCell);
                }
                ExcelRange cells = worksheet.Cells[startRow ?? 4, 1, startRow ?? 4, headers.Count];
                cells.AutoFilter = true;
            }
            catch (Exception)
            {
                throw;
            }
        }


        private void setHeaderWidth(ref ExcelRange headerCell)
        {
            var value = headerCell.Value.ToString().Trim().ToLower();
            if (value == "description")
            {
                // set min width for Description Column
                headerCell.AutoFitColumns(40);
            }
            else if (value == "pcn source" || value == "ds")
            {
                headerCell.AutoFitColumns(100);
            }
            else
            {
                headerCell.AutoFitColumns(20);
            }
        }
        private void WriteRow(ExcelWorksheet worksheet, IList<object> values, int rowId)
        {
            ExcelRange cells = worksheet.Cells[rowId, 1, rowId, values.Count];
            cells.Style.Font.Name = "Arial";
            cells.Style.Font.Size = 12;
            cells.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            cells.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            //bool PotintialFlag = false;
            try
            {
                for (var i = 0; i < values.Count; i++)
                {
                    worksheet.Cells[rowId, i + 1].Value = values[i];
                    if (values[i].ToString().Contains("(Potintial)"))
                    {
                        // PotintialFlag = true;
                        worksheet.Cells[rowId, i + 1].Style.Fill.PatternType = ExcelFillStyle.Solid;
                        worksheet.Cells[rowId, i + 1].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.FromArgb(155, 209, 248));
                    }
                    //if (values[i].ToString().Contains("Unknown"))
                    //{
                    //    PotintialFlag = true;
                    //    worksheet.Cells[rowId, i + 1].Style.Fill.PatternType = ExcelFillStyle.Solid;
                    //    worksheet.Cells.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.FromArgb(247, 250, 255));
                    //    worksheet.Cells[rowId, i + 1].Style.Font.Color.SetColor(System.Drawing.Color.FromArgb(255, 0, 0));
                    //}
                }
                if (rowId % 2 == 0)
                {
                    cells.Style.Fill.PatternType = ExcelFillStyle.Solid;
                    cells.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.FromArgb(220, 230, 241));
                }
                else
                {
                    cells.Style.Fill.PatternType = ExcelFillStyle.Solid;
                    cells.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.FromArgb(242, 242, 242));
                }
                SetBorder(ref cells);
            }
            catch (Exception ex)
            { }
        }

        private void SetBorder(ref ExcelRange range)
        {
            range.Style.Border.Top.Style = ExcelBorderStyle.Thin;
            range.Style.Border.Right.Style = ExcelBorderStyle.Thin;
            range.Style.Border.Left.Style = ExcelBorderStyle.Thin;
            range.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
        }
        private void SetTemplateValues(ref ExcelWorksheet worksheet, Dictionary<string, string> substitutionValue)
        {
            var TitleCell = worksheet.Cells[2, 2];
            TitleCell.Value = substitutionValue["TemplateName"] ?? "Generic Template";
            var TimeCell = worksheet.Cells[3, 2];
            TimeCell.Value = "Generated " + String.Format("{0:dd-MMM-yy}", DateTime.Now);
            var ByCell = worksheet.Cells[4, 2];
            ByCell.Value = "Exported by " + (substitutionValue["Username"] ?? "Administrator");
            var IsValidSheetName = substitutionValue.TryGetValue("SheetName", out string sheetName);
            worksheet.Name = IsValidSheetName && !string.IsNullOrEmpty(sheetName) ? sheetName : "Sheet1";
        }
        private void SetTemplateValuesReportStyle(ref ExcelWorksheet worksheet, Dictionary<string, string> substitutionValue)
        {
            
            var TimeCell = worksheet.Cells[2, 10];
            TimeCell.Value = String.Format("{0:MMMM dd, yyyy}", DateTime.Now);
            var ByCell = worksheet.Cells[3, 10];
            ByCell.Value = (substitutionValue["Username"] ?? "Administrator");
            //var ReportNameCell = worksheet.Cells["A4"];
            //ByCell.Value = (substitutionValue["ReportName"] ?? "Report");
            var IsValidSheetName = substitutionValue.TryGetValue("SheetName", out string sheetName);
            worksheet.Name = IsValidSheetName && !string.IsNullOrEmpty(sheetName) ? sheetName : worksheet.Name;
            var sheetLabel = worksheet.Cells[2, 1];
            sheetLabel.Value = worksheet.Name;
            var sheetDescription = worksheet.Cells[3, 1];
            sheetDescription.Value = "A list of " + worksheet.Name;
        }
        private void SetFrozenPane(ref ExcelWorksheet worksheet, Dictionary<string, string> substitutionValue)
        {
            if (substitutionValue.TryGetValue("FrozenRow", out string RowValue) && substitutionValue.TryGetValue("FrozenColumn", out string ColValue))
            {
                if (int.Parse(RowValue) != 0 && int.Parse(ColValue) != 0)
                {
                    worksheet.View.FreezePanes(int.Parse(RowValue) + 1, int.Parse(ColValue) + 1);
                }
            }
        }

    }
}
