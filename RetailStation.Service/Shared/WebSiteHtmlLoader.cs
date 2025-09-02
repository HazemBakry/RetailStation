using System;
using System.Threading;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;

namespace RetailStation.Service.Shared
{
    public class WebSiteHtmlLoader
    {
        public static string RenderedHtmlPage(string webSiteUri, string jwtToken)
        {
            string HTML = string.Empty;
            ChromeDriverService service = ChromeDriverService.CreateDefaultService();
            service.HideCommandPromptWindow = true;

            var options = new ChromeOptions();
            options.AddArgument("--headless");
            options.AddArgument("--disable-gpu");
            options.AddArgument("--no-sandbox");
            options.AddArgument("--disable-dev-shm-usage");
            options.AddUserProfilePreference("profile.default_content_setting_values.images", 2);
            options.AddUserProfilePreference("profile.managed_default_content_settings.stylesheets", 2);
            options.AddArgument("--disable-blink-features=AutomationControlled");
            options.PageLoadStrategy = PageLoadStrategy.Normal;

            try
            {
                using (var htmlLoader = new ChromeDriver(service, options))
                {
                    IJavaScriptExecutor jsExecutor = (IJavaScriptExecutor)htmlLoader;
                    htmlLoader.Navigate().GoToUrl(webSiteUri);
                    jsExecutor.ExecuteScript($"localStorage.setItem('JWT_TOKEN', '{jwtToken}');");

                    var wait = new WebDriverWait(htmlLoader, TimeSpan.FromMinutes(3));
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

                    jsExecutor.ExecuteScript(@"document.getElementById('ReportImage').src = 'http://localhost:63246/ReportImage/logo2.png';");
                    wait.Until(driver => driver.FindElement(By.Id("ReportImage")).GetAttribute("src").Contains("logo2.png"));

                    HTML = htmlLoader.FindElement(By.Id("ReportData")).GetAttribute("outerHTML");
                }
            }
            catch (Exception ex)
            {
                return null;
            }

            return string.IsNullOrEmpty(HTML) ? null : HTML;
        }
    }
}
