﻿using System.Web.Mvc;
using Ext.Net;
using Ext.Net.MVC;
using Kochbuch.Code;

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
            return node != "Root" ?
                new StoreResult(new NodeCollection()) :
                new StoreResult(Kapitel.GetChapters());
        }
    }
}
