using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
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

        static CustomerController()
        {
            DemoData = GenerateDemoData();
        }

        // GET api/customer/5
        public Customer GetCustomer(int id)
        {
            return DemoData.FirstOrDefault(c => c.Id == id);
        }

        // GET api/customer
        public object GetCustomers([FromUri]StoreRequestParametersForGrid parameters)
        {
            // Fallback
            if (parameters.Start == -1 || parameters.Limit == -1)
            {
                return new StoreResult(DemoData, DemoData.Count);
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

        // POST api/customer
        public HttpResponseMessage Post([FromBody]Customer customer)
        {
            int newId = DemoData.Max(c => c.Id);
            customer.Id = newId;
            DemoData.Add(customer);

            return Request.CreateResponse(HttpStatusCode.Created, customer);
        }

        // PUT api/customer/5
        public HttpResponseMessage Put(int id, [FromBody]Customer customer)
        {
            var foundCustomer = DemoData.FirstOrDefault(c => c.Id == id);
            if (foundCustomer == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound, id);
            }

            foundCustomer.FirstName = customer.FirstName;
            foundCustomer.LastName = customer.LastName;
            foundCustomer.Mail = customer.Mail;

            return Request.CreateResponse(HttpStatusCode.OK, foundCustomer);
        }                  

        // DELETE api/<controller>/5
        public HttpResponseMessage Delete(int id)
        {
            var foundCustomer = DemoData.FirstOrDefault(c => c.Id == id);
            if (foundCustomer == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound, id);
            }

            DemoData.Remove(foundCustomer);
            return Request.CreateResponse(HttpStatusCode.OK, id);
        }

        [Route("api/customer/reset")]
        public HttpResponseMessage GetReset()
        {
            DemoData = GenerateDemoData();
            return Request.CreateResponse(HttpStatusCode.OK, "Demo Data was resetted!");
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
