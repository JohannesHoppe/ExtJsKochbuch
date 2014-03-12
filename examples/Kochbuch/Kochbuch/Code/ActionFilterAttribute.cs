using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Kochbuch.Code
{
    public class ExposeCodeAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            ControllerBase controller = filterContext.Controller;
            string actionName = filterContext.ActionDescriptor.ActionName;
            object model = filterContext.Controller.ViewData.Model;


            string code = RenderView.RenderRazorViewToString(controller, actionName, model);
            code = code.ExtractBetween("<!-- body -->", "<!-- /body -->", false);
            code = code.Trim();
            SetViewData(filterContext, "Code", code);
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