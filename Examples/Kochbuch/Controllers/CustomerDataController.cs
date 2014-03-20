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
using Kochbuch.Models;
using System.Linq.Dynamic;

namespace Kochbuch.Controllers
{
    public class CustomerDataController : ApiController
    {
        public static IList<CustomerData> DemoData { get; private set; }

        public object GetDemoData(StoreRequestParameters parameters)
        {
            if (DemoData == null) 
            {
                DemoData = GenerateDemoData();
            }

            var reducedData = (parameters != null) ? 
                DemoData
                    .AsQueryable()
                    .OrderBy(string.Concat(parameters.SimpleSort, " ", parameters.SimpleSortDirection.ToString()))
                    .Skip(parameters.Start).Take(parameters.Limit)
                    .ToList() : 
                DemoData
                    .OrderBy(c => c.Id)
                    .ToList();

            return new StoreResult(reducedData, DemoData.Count);
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
            return session.List<CustomerData>(1000).Get();
        }
    }
}
