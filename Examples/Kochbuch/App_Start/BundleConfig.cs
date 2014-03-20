using System.Web.Optimization;

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
                        "~/Scripts/hash.js",
                        "~/Scripts/highlight.pack.js",
                        "~/Scripts/tabManager.js",
                        "~/Scripts/exampleTree.js"));

            bundles.Add(new StyleBundle("~/Content/styles").Include(
                        "~/Scripts/styles/github.css",
                        "~/Content/fonts.css",
                        "~/Content/main.css"));
        }
    }
}