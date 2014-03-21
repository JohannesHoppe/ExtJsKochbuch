using System.Linq;
using Ext.Net;

namespace Kochbuch.Code
{
    // StoreRequestParameters provides an initialized Sort array that supports multiple sorts
    // This class simplifies the usage of StoreRequestParameters
    public class StoreRequestParametersForGrid : StoreRequestParameters
    {
        public string SortDir
        {
            get
            {
                return Sort.Any() ? Sort.First().Direction.ToString() : null;
            }
        }

        public string SortProp
        { 
            get
            {
                return Sort.Any() ? Sort.First().Property : null;
            }
        } 
    }
}