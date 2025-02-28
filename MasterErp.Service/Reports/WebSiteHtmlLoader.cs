using System;
using System.Threading;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;

namespace MasterErp.Service.Reports
{
    public class WebSiteHtmlLoader
    {
        public static string RenderedHtmlPage(string webSiteUri)
        {
            ChromeDriver htmlLoader = null;
            string HTML = string.Empty;
            try
            {
                var URL = new Uri(webSiteUri, UriKind.Absolute);
                var options = new ChromeOptions()
                {
                    PageLoadStrategy = PageLoadStrategy.Normal
                };

                using (htmlLoader = new ChromeDriver(options))
                {
                    try
                    {
                        htmlLoader.Navigate().GoToUrl(URL);
                    }
                    catch (Exception ex)
                    {
                        htmlLoader.Quit();
                        return null;
                    }
                    var wait = new WebDriverWait(htmlLoader, TimeSpan.FromMinutes(3));
                    wait.Until(driver =>
                    {
                        var isFind = false;
                        int counter = 0;
                        do
                        {
                            try
                            {
                                var el = driver.FindElement(By.Id("ReportData"));
                                if (el != null)
                                    isFind = true;
                            }
                            catch (Exception)
                            {
                                Thread.Sleep(1000);
                                if (++counter >= (3 * 60) - 10)
                                {
                                    return false;
                                }
                            }

                        }
                        while (!isFind);
                        HTML = driver.FindElement(By.Id("ReportData")).GetAttribute("outerHTML");

                        return true;
                    });

                    htmlLoader.Quit();
                    if (string.IsNullOrEmpty(HTML))
                        return null;
                    else
                        return HTML;

                }
            }
            catch (Exception ex)
            {
                if (htmlLoader != null)
                    try
                    {
                        htmlLoader.Quit();
                    }
                    catch (Exception)
                    {
                    }

                return null;
            }
        }
    }
}
