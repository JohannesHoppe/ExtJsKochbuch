using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Kochbuch.Controllers
{
    public class Chapter1Controller: Controller
    {
        public ActionResult HelloWorld()
        {
            return View();
        }
    }
}