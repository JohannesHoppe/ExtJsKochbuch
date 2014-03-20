using System.Web;
using System.Web.Optimization;
using System.Web.Routing;
using Kochbuch.App_Start;

namespace Kochbuch
{
    public class MvcApplication : HttpApplication
    {
        protected void Application_Start()
        {
            WebApiConfig.Start();
            FilterConfig.Start();
            RouteConfig.Start();
            BundleConfig.Start();
        }
    }
}
