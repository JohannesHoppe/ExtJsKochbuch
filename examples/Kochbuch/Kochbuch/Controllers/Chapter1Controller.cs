using System.Web.Mvc;

namespace Kochbuch.Controllers
{
    public class Chapter1Controller: Controller
    {
        public ActionResult HelloWorld()
        {
            return View();
        }

        public ActionResult HelloWorldNet()
        {
            return View();
        }
    }
}