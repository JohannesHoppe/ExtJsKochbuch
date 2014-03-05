using System.Web.Optimization;
using Kochbuch.App_Start;

[assembly: WebActivatorEx.PreApplicationStartMethod(typeof(BundleConfig), "Start")]

namespace Kochbuch.App_Start
{
    public class BundleConfig
    {
        public static void Start()
        {
            RegisterBundles(BundleTable.Bundles);
        }

        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/Scripts/scripts").Include(
                        "~/Scripts/tabManager.js",
                        "~/Scripts/exampleTree.js"));

            bundles.Add(new StyleBundle("~/Content/styles").Include(
                        "~/Content/fonts.css",
                        "~/Content/main.css"));
        }
    }
}