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
    /// <summary>
    /// An Ext JS grid-compatible resource of customers
    /// </summary>
    public class CustomerController : ApiController
    {
        public static IList<Customer> DemoData { get; private set; }

        static CustomerController()
        {
            DemoData = GenerateDemoData();
        }

        // GET api/customer/5
        /// <summary>
        /// Gets one customer by its Id
        /// </summary>
        /// <returns>One customer</returns>
        public Customer GetCustomer(int id)
        {
            return DemoData.FirstOrDefault(c => c.Id == id);
        }

        // GET api/customer
        /// <summary>
        /// Gets a list of customers, accepts parameters for sorting and paging
        /// </summary>
        /// <returns>A list of customers and additional details about the query</returns>
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
        /// <summary>
        /// Creates a new customer
        /// </summary>
        /// <param name="customer">Customer data</param>
        /// <returns>All the data of the customer</returns>
        public HttpResponseMessage Post([FromBody]Customer customer)
        {
            int newId = DemoData.Max(c => c.Id);
            customer.Id = newId;
            DemoData.Add(customer);

            return Request.CreateResponse(HttpStatusCode.Created, customer);
        }

        // PUT api/customer/5
        /// <summary>
        /// Updates an existing customer
        /// </summary>
        /// <param name="id">The Id of the customer</param>
        /// <param name="customer">Customer object</param>
        /// <returns>200 and customer data OR 404 and id</returns>
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
        /// <summary>
        /// Deletes one customer by id
        /// </summary>
        /// <param name="id">The id of the costomer</param>
        /// <returns>404 or 200</returns>
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

        /// <summary>
        /// Resets the in-memory demo data to its initial state
        /// </summary>
        /// <returns>200 and a text</returns>
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
            IList<Customer> customers = session.List<Customer>(101).Get();
            customers.RemoveAt(0);
            return customers;
        }
    }
}
