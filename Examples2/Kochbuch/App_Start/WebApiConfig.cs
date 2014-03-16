using System.Web.Http;
using Kochbuch.App_Start;

[assembly: WebActivatorEx.PreApplicationStartMethod(typeof(WebApiConfig), "Start")]

namespace Kochbuch.App_Start
{
    public static class WebApiConfig
    {
        public static void Start()
        {
            Register(GlobalConfiguration.Configuration);
        }

        public static void Register(HttpConfiguration config)
        {
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}
