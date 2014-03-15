using System.Web.Mvc;
using System.Web.Routing;
using Kochbuch.App_Start;

[assembly: WebActivatorEx.PreApplicationStartMethod(typeof(RouteConfig), "Start")]

namespace Kochbuch.App_Start
{
    public class RouteConfig
    {
        public static void Start()
        {
            RegisterRoutes(RouteTable.Routes);
        }

        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("favicon.ico");
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            // Ignore all ext.axd embedded resource paths
            routes.IgnoreRoute("{extnet-root}/{extnet-file}/ext.axd");

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
