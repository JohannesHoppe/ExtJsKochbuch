using System.Web.Mvc;
using Ext.Net;
using Ext.Net.MVC;
using Kochbuch.Models;

namespace Kochbuch.Controllers
{
    public class ExtNetController : Controller
    {
        public ActionResult Index()
        {
            ExtNetModel model = new ExtNetModel()
            {
                Title = "Welcome to Ext.NET",
                TextAreaEmptyText = ">> Enter a Message Here <<"
            };

            return this.View(model);
        }

        public ActionResult SampleAction(string message)
        {
            X.Msg.Notify(new NotificationConfig
            {
                Icon = Icon.Accept,
                Title = "Working",
                Html = message
            }).Show();

            return this.Direct();
        }
    }
}