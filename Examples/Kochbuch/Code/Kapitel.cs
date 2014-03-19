using Ext.Net;

namespace Kochbuch.Code
{
    public class Kapitel
    {
        public static NodeCollection GetChapters()
        {
            var example1 = new Node
                               {
                                   NodeID = "HelloWorld",
                                   Text = "Hello World (Ext JS)",
                                   Href = "/Kapitel1/HelloWorld",
                                   Icon = Icon.World,
                                   Leaf = true
                               };

            var example2 = new Node
                               {
                                   NodeID = "HelloWorldNet",
                                   Text = "Hello World (Ext.NET)",
                                   Href = "/Kapitel1/HelloWorldNet",
                                   Icon = Icon.World,
                                   Leaf = true
                               };

            var example3 = new Node
            {
                NodeID = "Class",
                Text = "Ext JS Klasse",
                Href = "/Kapitel2/Class",
                Icon = Icon.World,
                Leaf = true
            };

            var example4 = new Node
            {
                NodeID = "Inheritence",
                Text = "Ext JS Vererbung",
                Href = "/Kapitel2/Inheritence",
                Icon = Icon.World,
                Leaf = true
            };

            var example5 = new Node
            {
                NodeID = "Mixins",
                Text = "Ext JS Mixins",
                Href = "/Kapitel2/Mixins",
                Icon = Icon.World,
                Leaf = true
            };

            var example6 = new Node
            {
                NodeID = "Store",
                Text = "Store",
                Href = "/Kapitel4/Store",
                Icon = Icon.World,
                Leaf = true
            };


            /*
            var example5b = new Node
            {
                NodeID = "Mixins2",
                Text = "Ext JS Mixins - Labelable",
                Href = "/Kapitel2/Mixins2",
                Icon = Icon.World,
                Leaf = true
            };
            */

            var jsFiddle = new Node
            {
                NodeID = "jsFiddle_grid",
                Text = "jsFiddle: Grid ",
                Href = "http://jsfiddle.net/gh/get/extjs/4.2/JohannesHoppe/ExtJsKochbuch/tree/master/Examples/FiddleGrid",
                Icon = Icon.WeatherCloud,
                Leaf = true
            };

            var kapitel1 = new Node { Text = "Kapitel 1" };
            var kapitel2 = new Node { Text = "Kapitel 2" };
            var kapitel4 = new Node { Text = "Kapitel 4" };
            var chapterX = new Node { Text = "Playground" };

            kapitel1.Children.AddRange(new[] { example1, example2 });
            kapitel2.Children.AddRange(new[] { example3, example4, example5 });
            kapitel4.Children.AddRange(new[] { example6 });
            chapterX.Children.AddRange(new[] { jsFiddle });

            var nodes = new NodeCollection
                            {
                                kapitel1,
                                kapitel2,
                                kapitel4,
                                chapterX
                            };
            return nodes;
        }
    }
}