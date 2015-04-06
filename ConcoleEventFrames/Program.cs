using System;
using System.Diagnostics;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using AfHelper;

namespace ConcoleEventFrames
{
    class Program
    {
        static void Main(string[] args)
        {
            ChoosePill();
        }

        static void ChoosePill() {
            Console.WriteLine("1. Get event frames.\n2. Create eventframe \n3. Delete eventframe\nEnter to close");
            var choice = Console.ReadLine();
            var Helper = new Helper();
            switch (choice) {
                    case "1": 
                    Console.WriteLine(Helper.GetEventFrames());
                    Console.WriteLine();
                    ChoosePill ();
                    break;
                
                case "2":
                    var watch = Stopwatch.StartNew();
                    for (var i = 0; i < 10000; i++) {
                        Console.WriteLine(Helper.CreateEventFrame());
                    }
                    watch.Stop();
                    var elapsedS = watch.Elapsed.Seconds;
                    var elapsedM = watch.Elapsed.Minutes;
                    Console.WriteLine("Time execution: {0} m {1} s", elapsedM, elapsedS);
                    Console.WriteLine();
                   
                    ChoosePill ();
                    break;
                case "3":
                    Console.Write("Enter mask:");
                    var mask = Console.ReadLine();
                    var result = Helper.DeleteEventFrame(mask);
                    Console.WriteLine("Deleted {0} items", result);
                    Console.WriteLine();
                    Console.ReadLine();
                    break;
                
                default: 
                    break;
                
            }
        }
    }
}
