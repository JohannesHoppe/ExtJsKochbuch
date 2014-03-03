using System.Web.Mvc;
using Ext.Net;

namespace Kochbuch.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult GetExamplesNodes()
        {
            return this.Json(new NodeCollection()
                                 {
                                   new Node()
                                       {
                                           Text = "Kapitel 1"
                                           
                                       }
                                 });
        }
    }
}
