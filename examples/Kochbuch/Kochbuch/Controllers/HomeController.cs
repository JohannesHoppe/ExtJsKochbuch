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

        
        public StoreResult GetChapters(string node)
        {
            if (node != "Root")
            {
                return new StoreResult(new NodeCollection());
            }

            var example1 = new Node
            {
                NodeID = BaseControl.GenerateID(),
                Text = "Hello World",
                Leaf = true
            };

            var chapter1 = new Node
            {
                NodeID = BaseControl.GenerateID(),
                Text = "Kapitel 1"
            };

            chapter1.Children.Add(example1);

            var chapter2 = new Node
            {
                NodeID = BaseControl.GenerateID(),
                Text = "Kapitel 2"
            };

            var nodes = new NodeCollection
                            {
                                chapter1, 
                                chapter2
                            };

            return new StoreResult(nodes);
        }
    }
}
