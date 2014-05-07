using System.Web.Mvc;
using Kochbuch.Code;

namespace Kochbuch.Controllers
{
    [ExposeCode]
    public class Kapitel2Controller: Controller
    {
        public ActionResult Class()
        {
            return View();
        }

        public ActionResult Inheritence()
        {
            return View();
        }

        public ActionResult Mixins()
        {
            return View();
        }

        public ActionResult Mixins2()
        {
            return View();
        }
    }
}