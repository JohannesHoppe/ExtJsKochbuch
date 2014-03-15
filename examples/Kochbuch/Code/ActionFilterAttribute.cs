using System;
using System.IO;
using System.Web;
using System.Web.Mvc;

namespace Kochbuch.Code
{
    public class ExposeCodeAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            string controllerName = (string)filterContext.RouteData.Values["controller"];
            string actionName = (string)filterContext.RouteData.Values["action"];
            string viewPath = HttpContext.Current.Server.MapPath(String.Format("~/Views/{0}/{1}.cshtml", controllerName, actionName));
            string viewContent = File.ReadAllText(viewPath).Trim();
            SetViewData(filterContext, "Code", viewContent);
        }

        public static void SetViewData(ActionExecutedContext filterContext, string key, object value)
        {
            var actionResult = filterContext.Result as ViewResult;
            if (actionResult != null)
            {
                actionResult.ViewData[key] = value;
            }
        }
    }
}