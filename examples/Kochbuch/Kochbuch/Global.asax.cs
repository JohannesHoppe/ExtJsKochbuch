using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using Kochbuch.App_Start;

namespace Kochbuch
{
    public class MvcApplication : HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            RouteConfig.RegisterRoutes(RouteTable.Routes);
        }
    }
}
