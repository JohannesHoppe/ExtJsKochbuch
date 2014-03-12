using Ext.Net;

namespace Kochbuch.Controllers
{
    public class Chapters
    {
        public static NodeCollection GetChapters()
        {
            var example1 = new Node
                               {
                                   Text = "Hello World (Ext JS)",
                                   Href = "/Kapitel1/HelloWorld",
                                   Icon = Icon.World,
                                   Leaf = true
                               };

            var example2 = new Node
                               {
                                   Text = "Hello World (Ext.NET)",
                                   Href = "/Kapitel1/HelloWorldNet",
                                   Icon = Icon.World,
                                   Leaf = true
                               };

            var example3 = new Node
            {
                Text = "Ext JS Klasse",
                Href = "/Kapitel2/Class",
                Icon = Icon.World,
                Leaf = true
            };

            var example4 = new Node
            {
                Text = "Ext JS Vererbung",
                Href = "/Kapitel2/Inheritence",
                Icon = Icon.World,
                Leaf = true
            };

            var chapter1 = new Node { Text = "Kapitel 1" };
            var chapter2 = new Node { Text = "Kapitel 2" };

            chapter1.Children.AddRange(new[] { example1, example2 });
            chapter2.Children.AddRange(new[] { example3, example4 });

            var nodes = new NodeCollection
                            {
                                chapter1,
                                chapter2
                            };
            return nodes;
        }
    }
}