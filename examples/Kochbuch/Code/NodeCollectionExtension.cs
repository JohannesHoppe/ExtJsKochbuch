using Ext.Net;
using Newtonsoft.Json.Linq;

namespace Kochbuch.Code
{
    public static class NodeCollectionExtension
    {
        /// <summary>
        /// Formats the node-collection to the format that the tree expects
        /// </summary>
        /// <param name="collection">NodeCollection</param>
        /// <returns>parsed tree</returns>
        public static dynamic ToTree(this NodeCollection collection)
        {
            string json = collection.ToJson();
            dynamic jObject = JArray.Parse(json);
            return jObject;
        }
    }
}