using System;
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
            Console.WriteLine("1. Get event frames.\n2. Create eventframe\nEnter to close");
            var choice = Console.ReadLine();
            var Helper = new Helper();
            switch (choice) {
                    case "1": 
                    Console.WriteLine(Helper.GetEventFrames());
                    Console.WriteLine();
                    ChoosePill ();
                    break;
                
                case "2": 
                    Console.WriteLine(Helper.CreateEventFrame());
                    Console.WriteLine();
                    ChoosePill ();
                    break;
                
                default: 
                    break;
                
            }
        }
    }
}
