using System.Web.Mvc;

namespace Kochbuch.App_Start
{
    public class FilterConfig
    {
        public static void Start()
        {
            RegisterGlobalFilters(GlobalFilters.Filters);
        }

        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}