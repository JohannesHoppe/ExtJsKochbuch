using System.Web.Mvc;
using Kochbuch.Code;

namespace Kochbuch.Controllers
{
    [ExposeCode]
    public class Kapitel1Controller: Controller
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