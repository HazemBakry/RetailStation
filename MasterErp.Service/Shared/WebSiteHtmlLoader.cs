using System;
using System.IO;
using System.Threading;
using Microsoft.AspNetCore.Hosting;
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
                var options = new ChromeOptions()
                {
                    PageLoadStrategy = PageLoadStrategy.Normal
                };

                using (htmlLoader = new ChromeDriver(options))
                {
                    IJavaScriptExecutor jsExecutor = (IJavaScriptExecutor)htmlLoader;
                    try
                    {
                        htmlLoader.Navigate().GoToUrl(URL);
                        jsExecutor.ExecuteScript($"localStorage.setItem('JWT_TOKEN', '{jwtToken}');");
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
                                if (++counter >= 3 * 60)
                                {
                                    return false;
                                }
                            }

                        }
                        while (!isFind);


                        var imageElement = htmlLoader.FindElement(By.Id("ReportImage"));
                        if (imageElement != null)
                        {
                            jsExecutor.ExecuteScript(@"var img = document.getElementById('ReportImage');img.src = 'http://localhost:63246/ReportImage/logo2.png';");
                            Thread.Sleep(1000);
                            HTML = driver.FindElement(By.Id("ReportData")).GetAttribute("outerHTML");
                        }

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
