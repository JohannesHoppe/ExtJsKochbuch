using System.Web;
using System.Web.Mvc;
using Kochbuch.App_Start;

namespace Kochbuch
{
    public class MvcApplication : HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas(); 

            WebApiConfig.Start();
            FilterConfig.Start();
            RouteConfig.Start();
            BundleConfig.Start();
        }
    }
}
