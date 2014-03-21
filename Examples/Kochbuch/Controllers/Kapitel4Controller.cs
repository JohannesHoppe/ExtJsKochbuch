using System.Web.Mvc;
using Kochbuch.Code;

namespace Kochbuch.Controllers
{
    [ExposeCode]
    public class Kapitel4Controller: Controller
    {
        public ActionResult Store()
        {
            return View();
        }

        public ActionResult StoreNet()
        {
            return View();
        }

        public ActionResult Grid()
        {
            return View();
        }

        public ActionResult GridNet()
        {
            return View();
        }
    }
}