using System.Linq;
using System.Net.Http.Formatting;
using System.Web.Http;

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

            // removes Xml Formater from WebApi for easy debugging
            MediaTypeFormatterCollection formatters = GlobalConfiguration.Configuration.Formatters;
            formatters.Remove(formatters.XmlFormatter);
        }
    }
}
