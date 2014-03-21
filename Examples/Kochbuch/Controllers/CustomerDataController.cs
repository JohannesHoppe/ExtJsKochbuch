using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using AutoPoco;
using AutoPoco.DataSources;
using AutoPoco.Engine;
using Ext.Net;
using Ext.Net.MVC;
using Kochbuch.Code;
using Kochbuch.Models;
using System.Linq.Dynamic;

namespace Kochbuch.Controllers
{
    public class CustomerDataController : ApiController
    {
        public static IList<CustomerData> DemoData { get; private set; }

        public object GetDemoData([FromUri]StoreRequestParametersForGrid parameters)
        {
            if (DemoData == null) 
            {
                DemoData = GenerateDemoData();
            }

            List<CustomerData> result = (parameters.SortProp == null)
                ? DemoData.AsQueryable()
                            .Skip(parameters.Start)
                            .Take(parameters.Limit).ToList()
                : DemoData.AsQueryable()
                            .OrderBy(parameters.SortProp + " " + parameters.SortDir)
                            .Skip(parameters.Start)
                            .Take(parameters.Limit).ToList();

            return new StoreResult(result, DemoData.Count);
        }

        private static IList<CustomerData> GenerateDemoData()
        {
            IGenerationSessionFactory factory = AutoPocoContainer.Configure(x =>
                {
                    x.Conventions(c => c.UseDefaultConventions());
                    x.AddFromAssemblyContainingType<CustomerData>();

                    x.Include<CustomerData>()
                        .Setup(c => c.Id).Use<IntegerIdSource>()
                        .Setup(c => c.FirstName).Use<FirstNameSource>()
                        .Setup(c => c.LastName).Use<LastNameSource>()
                        .Setup(c => c.Mail).Use<EmailAddressSource>();
                });

            IGenerationSession session = factory.CreateSession();
            return session.List<CustomerData>(100).Get();
        }
    }
}
