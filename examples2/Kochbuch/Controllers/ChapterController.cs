using System.Net;
using System.Net.Http;
using System.Web.Http;
using Ext.Net;
using Ext.Net.MVC;
using Kochbuch.Code;

namespace Kochbuch.Controllers
{
    /// <summary>
    /// An Ext JS treeview compatible resource of chapters
    /// </summary>
    public class ChapterController : ApiController
    {
        // GET api/<controller>
        /// <summary>
        /// Gets the root of the tree
        /// </summary>
        /// <returns>The tree</returns>
        public StoreResult Get()
        {
            return Get("Root");
        }

        // GET api/<controller>/5
        /// <summary>
        /// Gets the root of the tree OR an empty tree node
        /// </summary>
        /// <param name="node">Node to be expanded, topmost node is called 'Root'</param>
        /// <returns>The tree</returns>
        public StoreResult Get(string node)
        {
            return node == "Root" ?
                new StoreResult(Kapitel.GetChapters().ToTree()) :
                new StoreResult(new NodeCollection().ToTree());
        }
    }
}