using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using AutoPoco;
using AutoPoco.DataSources;
using AutoPoco.Engine;
using Ext.Net.MVC;
using Kochbuch.Code;
using Kochbuch.Models;
using System.Linq.Dynamic;

namespace Kochbuch.Controllers
{
    public class CustomerController : ApiController
    {
        public static IList<Customer> DemoData { get; private set; }

        public object GetDemoData([FromUri]StoreRequestParametersForGrid parameters)
        {
            if (DemoData == null) 
            {
                DemoData = GenerateDemoData();
            }

            List<Customer> result = (parameters.SortProp == null)
                ? DemoData.AsQueryable()
                            .Skip(parameters.Start)
                            .Take(parameters.Limit).ToList()
                : DemoData.AsQueryable()
                            .OrderBy(parameters.SortProp + " " + parameters.SortDir)
                            .Skip(parameters.Start)
                            .Take(parameters.Limit).ToList();

            return new StoreResult(result, DemoData.Count);
        }

        private static IList<Customer> GenerateDemoData()
        {
            IGenerationSessionFactory factory = AutoPocoContainer.Configure(x =>
                {
                    x.Conventions(c => c.UseDefaultConventions());
                    x.AddFromAssemblyContainingType<Customer>();

                    x.Include<Customer>()
                        .Setup(c => c.Id).Use<IntegerIdSource>()
                        .Setup(c => c.FirstName).Use<FirstNameSource>()
                        .Setup(c => c.LastName).Use<LastNameSource>()
                        .Setup(c => c.Mail).Use<EmailAddressSource>();
                });

            IGenerationSession session = factory.CreateSession();
            return session.List<Customer>(100).Get();
        }
    }
}
