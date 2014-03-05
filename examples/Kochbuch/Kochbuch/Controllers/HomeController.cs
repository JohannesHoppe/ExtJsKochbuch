using System.Web.Mvc;
using Ext.Net;
using Ext.Net.MVC;

namespace Kochbuch.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Start()
        {
            return View();
        }

        public StoreResult GetChapters(string node)
        {
            if (node != "Root")
            {
                return new StoreResult(new NodeCollection());
            }

            var example1 = new Node
            {
                Text = "Hello World (Ext JS)",
                Href = "/Chapter1/HelloWorld",
                Icon = Icon.World,
                Leaf = true
            };

            var example2 = new Node
            {
                Text = "Hello World (Ext.NET)",
                Href = "/Chapter1/HelloWorldNet",
                Icon = Icon.World,
                Leaf = true
            };

            var chapter1 = new Node { Text = "Kapitel 1" };

            chapter1.Children.AddRange(new[] { example1, example2 });

            var chapter2 = new Node { Text = "Kapitel 2" };

            var nodes = new NodeCollection
                            {
                                chapter1, 
                                chapter2
                            };

            return new StoreResult(nodes);
        }
    }
}
