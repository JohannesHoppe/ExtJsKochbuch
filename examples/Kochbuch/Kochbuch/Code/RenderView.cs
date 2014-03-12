using System.IO;
using System.Web.Mvc;

namespace Kochbuch.Code
{
    public static class RenderView
    {
        public static string CurrentViewName(this HtmlHelper html)
        {
            return Path.GetFileNameWithoutExtension(((RazorView)html.ViewContext.View).ViewPath);
        }

        public static string RenderRazorViewToString(ControllerBase controller, string viewName, object model)
        {
            controller.ViewData.Model = model;
            using (var sw = new StringWriter())
            {
                var viewResult = ViewEngines.Engines.FindPartialView(controller.ControllerContext, viewName);
                var viewContext = new ViewContext(controller.ControllerContext, viewResult.View, controller.ViewData, controller.TempData, sw);
                viewResult.View.Render(viewContext, sw);
                viewResult.ViewEngine.ReleaseView(controller.ControllerContext, viewResult.View);
                return sw.GetStringBuilder().ToString();
            }
        }

        public static string ExtractBetween(this string str, string startTag, string endTag, bool inclusive)
        {
            string rtn = null;

            int s = str.IndexOf(startTag, System.StringComparison.Ordinal);
            if (s >= 0)
            {
                if (!inclusive)
                    s += startTag.Length;

                int e = str.IndexOf(endTag, s, System.StringComparison.Ordinal);
                if (e > s)
                {
                    if (inclusive)
                        e += startTag.Length;

                    rtn = str.Substring(s, e - s);
                }
            }

            return rtn;
        }
    }
}