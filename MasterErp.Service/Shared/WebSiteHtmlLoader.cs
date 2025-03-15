using System;
using System.Threading;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;

namespace MasterErp.Service.Shared
{
    public class WebSiteHtmlLoader
    {
        public static string RenderedHtmlPage(string webSiteUri, string jwtToken)
        {
            ChromeDriver htmlLoader = null;
            string HTML = string.Empty;
            try
            {
                var URL = new Uri(webSiteUri, UriKind.Absolute);
                var options = new ChromeOptions
                {
                    PageLoadStrategy = PageLoadStrategy.Normal
                };

                options.AddArgument("--headless");
                options.AddArgument("--disable-gpu");
                options.AddArgument("--no-sandbox");
                options.AddArgument("--disable-dev-shm-usage");

                int maxRetries = 3;
                for (int attempt = 0; attempt < maxRetries; attempt++)
                {
                    try
                    {
                        htmlLoader = new ChromeDriver(options);
                        break;
                    }
                    catch (WebDriverException)
                    {
                        if (attempt == maxRetries - 1) throw;
                        Thread.Sleep(2000);
                    }
                }

                IJavaScriptExecutor jsExecutor = (IJavaScriptExecutor)htmlLoader;
                htmlLoader.Navigate().GoToUrl(URL);
                jsExecutor.ExecuteScript($"localStorage.setItem('JWT_TOKEN', '{jwtToken}');");

                var wait = new WebDriverWait(htmlLoader, TimeSpan.FromMinutes(3));

                try
                {
                    wait.Until(driver =>
                    {
                        try
                        {
                            var element = driver.FindElement(By.Id("ReportData"));
                            return element.Displayed;
                        }
                        catch (NoSuchElementException)
                        {
                            return false;
                        }
                    });
                }
                catch (WebDriverTimeoutException)
                {
                    htmlLoader.Quit();
                    return null;
                }

                jsExecutor.ExecuteScript(@"document.getElementById('ReportImage').src = 'http://localhost:63246/ReportImage/logo2.png';");
                wait.Until(driver => driver.FindElement(By.Id("ReportImage")).GetAttribute("src").Contains("logo2.png"));
                HTML = htmlLoader.FindElement(By.Id("ReportData")).GetAttribute("outerHTML");
                htmlLoader.Quit();

                return string.IsNullOrEmpty(HTML) ? null : HTML;
            }
            catch (Exception)
            {
                htmlLoader?.Quit();
                return null;
            }
        }
    }
}
