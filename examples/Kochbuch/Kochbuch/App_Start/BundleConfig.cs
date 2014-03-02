using System.Web.Optimization;

namespace Kochbuch.App_Start
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/Scripts/scripts"));

            bundles.Add(new StyleBundle("~/Content/styles"));
        }
    }
}