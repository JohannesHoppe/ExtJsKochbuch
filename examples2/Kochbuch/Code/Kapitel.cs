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

            var example6 = new Node
            {
                NodeID = "Store",
                Text = "Store (Ext JS)",
                Href = "/Kapitel4/Store",
                Icon = Icon.World,
                Leaf = true
            };

            var example7 = new Node
            {
                NodeID = "StoreNet",
                Text = "Store (Ext.NET)",
                Href = "/Kapitel4/StoreNet",
                Icon = Icon.World,
                Leaf = true
            };

            var exampleHelp = new Node
            {
                NodeID = "Help",
                Text = "WebApi Help Page",
                Href = "/help",
                Icon = Icon.Information,
                Leaf = true
            };

            var example8 = new Node
            {
                NodeID = "Grid",
                Text = "Grid (Ext JS)",
                Href = "/Kapitel4/Grid",
                Icon = Icon.World,
                Leaf = true
            };

            var example9 = new Node
            {
                NodeID = "GridNet",
                Text = "Grid (Ext.NET)",
                Href = "/Kapitel4/GridNet",
                Icon = Icon.World,
                Leaf = true
            }; 

            var jsFiddleHelloWorld = new Node
            {
                NodeID = "jsFiddle_helloWorld",
                Text = "jsFiddle: Hello World ",
                Href = "http://jsfiddle.net/gh/get/extjs/4.2/JohannesHoppe/ExtJsKochbuch/tree/master/Examples/FiddleHelloWorld",
                Icon = Icon.WeatherCloud,
                Leaf = true
            };

            var jsFiddleNet = new Node
            {
                NodeID = "jsFiddle_grid",
                Text = "jsFiddle: Grid ",
                Href = "http://jsfiddle.net/gh/get/extjs/4.2/JohannesHoppe/ExtJsKochbuch/tree/master/Examples/FiddleGrid",
                Icon = Icon.WeatherCloud,
                Leaf = true
            };

            var extNetDemo = new Node
            {
                NodeID = "extNetDemo",
                Text = "Ext.Net Demo ",
                Href = "/ExtNet",
                Icon = Icon.Information,
                Leaf = true
            };
            var chat = new Node
            {
                NodeID = "chat",
                Text = "Teilnehmer-Chat",
                Href = "http://chatroll.com/embed/chat/ext-js-kochbuch?id=i3JL4RMYjAJ&platform=html&w=$0",
                Icon = Icon.Information,
                Leaf = true
            };

            var kapitel1 = new Node { Text = "Kapitel 1" };
            var kapitel2 = new Node { Text = "Kapitel 2" };
            var kapitel4 = new Node { Text = "Kapitel 4" };
            var chapterX = new Node { Text = "Playground" };

            kapitel1.Children.AddRange(new[] { example1, example2 });
            kapitel2.Children.AddRange(new[] { example3, example4, example5, exampleHelp });
            kapitel4.Children.AddRange(new[] { example6, example7, example8, example9 });
            chapterX.Children.AddRange(new[] { jsFiddleHelloWorld, jsFiddleNet, extNetDemo, chat });

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