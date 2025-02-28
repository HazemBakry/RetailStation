using MasterErp.Interface.Reports;
using Microsoft.AspNetCore.Hosting;
using System;
using System.IO;
using iText.Html2pdf;
using iText.Kernel.Pdf;
using iText.Layout;
using System.Text.RegularExpressions;
using Microsoft.SqlServer.Server;
using iText.Layout.Element;
using iText.Layout.Properties;
using iText.Kernel.Colors;
using iText.Kernel.Pdf.Canvas;
using iText.IO.Font.Constants;
using iText.Kernel.Font;

namespace MasterErp.Service.Reports
{
    public class Helper : IHelper
    {
        private readonly IWebHostEnvironment _environment;
        public Helper(IWebHostEnvironment environment)
        {
            _environment = environment;
        }
        public string SaveHTMLResult(string HTMLContent)
        {
            try
            {
                HTMLContent = ClearAngularAttrFromHTML(HTMLContent);
                HTMLContent = Regex.Unescape(HTMLContent);

                var FolderPath =System.IO.Path.Combine(_environment.WebRootPath, "Reports");
                if (!Directory.Exists(FolderPath))
                    Directory.CreateDirectory(FolderPath);

                var FilePath = System.IO.Path.Combine(FolderPath, Guid.NewGuid().ToString() + "_TestReport.pdf");
                ConvertHtmlToPdf(HTMLContent, FilePath);

                return FilePath;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public void ConvertHtmlToPdf(string HTMLContent, string outputPath)
        {
            try
            {
                string tempFile = Path.GetTempFileName();
                using (FileStream pdfStream = new FileStream(tempFile, FileMode.Create, FileAccess.Write, FileShare.None))
                {
                    PdfWriter writer = new PdfWriter(pdfStream);
                    PdfDocument pdfDocument = new PdfDocument(writer);
                    HtmlConverter.ConvertToPdf(HTMLContent, pdfDocument, new ConverterProperties());
                }
                using (PdfReader reader = new PdfReader(tempFile))
                using (PdfWriter writer = new PdfWriter(outputPath))
                {
                    PdfDocument pdfDocument = new PdfDocument(reader, writer);
                    AddFooter(pdfDocument);
                    pdfDocument.Close();
                }

                File.Delete(tempFile);
            }
            
            catch (Exception ex)
            {
                throw;
            }
        }

        private void AddFooter(PdfDocument pdfDocument)
        {
            int numberOfPages = pdfDocument.GetNumberOfPages();
            string currentDate = DateTime.Now.ToString("yyyy-MM-dd");

            PdfFont font = PdfFontFactory.CreateFont(StandardFonts.HELVETICA);

            for (int i = 1; i <= numberOfPages; i++)
            {
                PdfPage page = pdfDocument.GetPage(i);
                PdfCanvas canvas = new PdfCanvas(page);

                float pageWidth = page.GetPageSize().GetWidth();
                float margin = 40;
                float y = 20;

                string pageNumberText = $"Page {i} of {numberOfPages}";
                canvas.BeginText()
                    .SetFontAndSize(font, 10)
                    .SetColor(ColorConstants.BLACK, true)
                    .MoveText(margin, y)
                    .ShowText(pageNumberText)
                    .EndText();

                canvas.BeginText()
                    .SetFontAndSize(font, 10)
                    .SetColor(ColorConstants.BLACK, true)
                    .MoveText(pageWidth - margin - 50, y)
                    .ShowText(currentDate)
                    .EndText();

                canvas.Release();
            }
        }

        public string ClearAngularAttrFromHTML( string HTML)
        {
            try
            {
                if (string.IsNullOrEmpty(HTML))
                    return HTML;
                var splitor = new string[] { "<!---->", "z2dataconditions=\"\"", "textcolorstatus=\"\"" };
                var HTMLList = HTML.Split(splitor, StringSplitOptions.RemoveEmptyEntries);
                var html = string.Join("", HTMLList);
                html = Regex.Replace(html, "( _nghost-ng-cli-universal-c| _ngcontent-ng-cli-universal-c)[1-9]*=\"\"", "");
                html = Regex.Replace(html, "<!--([a-z]+)(?![^>]*\\/>)[^>]*-->", "");
                html = Regex.Replace(html, @"\s_ngcontent-[a-zA-Z0-9\-]+?=""[^""]*""", "");
                var splitor2 = new string[] { "<app-z2rendercomponent>", "</app-z2rendercomponent>", "<app-z2textcomponent>", "</app-z2textcomponent>", "<app-z2linkcomponent>", "</app-z2linkcomponent>" };
                HTMLList = html.Split(splitor2, StringSplitOptions.RemoveEmptyEntries);
                html = string.Join("", HTMLList);
                return html;
            }
            catch (Exception)
            {
            }
            return HTML;
        }
    }
}
