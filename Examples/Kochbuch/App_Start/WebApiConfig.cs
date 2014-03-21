using System.Linq;
using System.Net.Http.Formatting;
using System.Web.Http;

namespace Kochbuch.App_Start
{
    public static class WebApiConfig
    {
        public static void Start()
        {
            GlobalConfiguration.Configure(Register);
        }

        public static void Register(HttpConfiguration config)
        {
            // Attribute routing.
            config.MapHttpAttributeRoutes();

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
