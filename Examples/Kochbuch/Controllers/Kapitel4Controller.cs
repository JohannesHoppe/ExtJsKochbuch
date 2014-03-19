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
    }
}