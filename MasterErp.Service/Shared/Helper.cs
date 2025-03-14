using Microsoft.AspNetCore.Hosting;
using System;
using System.IO;
using iText.Html2pdf;
using iText.Kernel.Pdf;
using System.Text.RegularExpressions;
using iText.Kernel.Colors;
using iText.Kernel.Pdf.Canvas;
using iText.IO.Font.Constants;
using iText.Kernel.Font;
using iText.Layout.Font;
using iText.Kernel.Geom;
using MasterErp.Interface.Shared;

namespace MasterErp.Service.Shared
{
    public class Helper : IHelper
    {
        private readonly IWebHostEnvironment _environment;
        public Helper(IWebHostEnvironment environment)
        {
            _environment = environment;
        }
        public string SaveHTMLResult(string HTMLContent, bool IsLandScape)
        {
            try
            {
                HTMLContent = ClearAngularAttrFromHTML(HTMLContent);
                HTMLContent = Regex.Unescape(HTMLContent);

                var FolderPath = System.IO.Path.Combine(_environment.WebRootPath, "Reports");
                if (!Directory.Exists(FolderPath))
                    Directory.CreateDirectory(FolderPath);

                var FilePath = System.IO.Path.Combine(FolderPath, Guid.NewGuid().ToString() + "_Report.pdf");
                ConvertHtmlToPdf(HTMLContent, FilePath, IsLandScape);

                return FilePath;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public void ConvertHtmlToPdf(string HTMLContent, string outputPath, bool IsLandScape)
        {
            try
            {
                string tempFile = System.IO.Path.GetTempFileName();
                var ARFont = System.IO.Path.Combine(_environment.WebRootPath, "Fonts", "Cairo-Regular.ttf");
                using (FileStream pdfStream = new FileStream(tempFile, FileMode.Create, FileAccess.Write, FileShare.None))
                {
                    PdfWriter writer = new PdfWriter(pdfStream);
                    PdfDocument pdfDocument = new PdfDocument(writer);
                    FontProvider fontProvider = new FontProvider();
                    ConverterProperties properties = new ConverterProperties();
                    if (!IsLandScape)
                        pdfDocument.SetDefaultPageSize(PageSize.A4.Rotate());
                    fontProvider.AddFont(ARFont);
                    properties.SetCharset("UTF-8");
                    properties.SetFontProvider(fontProvider);
                    HtmlConverter.ConvertToPdf(HTMLContent, pdfDocument, properties);
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
            string currentDate = DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss tt");

            PdfFont font = PdfFontFactory.CreateFont(StandardFonts.HELVETICA);

            for (int i = 1; i <= numberOfPages; i++)
            {
                PdfPage page = pdfDocument.GetPage(i);
                PdfCanvas canvas = new PdfCanvas(page);

                float pageWidth = page.GetPageSize().GetWidth();
                float margin = 40;
                float margin22 = 100;
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
                    .MoveText(pageWidth - margin22 - 50, y)
                    .ShowText(currentDate)
                    .EndText();

                canvas.Release();
            }
        }

        public string ClearAngularAttrFromHTML(string HTML)
        {
            try
            {
                if (string.IsNullOrEmpty(HTML))
                    return HTML;
                HTML = Regex.Replace(HTML, "( _nghost-ng-cli-universal-c| _ngcontent-ng-cli-universal-c)[1-9]*=\"\"", "");
                HTML = Regex.Replace(HTML, "<!--([a-z]+)(?![^>]*\\/>)[^>]*-->", "");
                HTML = Regex.Replace(HTML, @"\s_ngcontent-[a-zA-Z0-9\-]+?=""[^""]*""", "");
                return HTML;
            }
            catch (Exception)
            {
            }
            return HTML;
        }
    }
}
