using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using OSIsoft.AF;
using OSIsoft.AF.Asset;
using OSIsoft.AF.EventFrame;
using OSIsoft.AF.Time;
using System.Security.Principal;
using System.Web;
using System.Web.Script.Serialization;

namespace AfHelper
{
    public class EventFrame {
        public string Id { get; set; }
        public string Name { get; set; }
        public string DateTime { get; set; }
    }

    public class Helper
    {
        public AFDatabase InitializeAf()
        {
            //отключил олицетворение клиента, код выполняется от учетки пула
            using (WindowsIdentity.Impersonate(IntPtr.Zero))
            {
                try
                {
                    var myPiSystem = new PISystems(true).DefaultPISystem;

                    if (myPiSystem == null)
                        throw new InvalidOperationException("Default PISystem was not found.");

                    myPiSystem.Connect();

                    return myPiSystem.Databases["Database"];

                }
                catch (Exception)
                {
                    return null;
                }
            }
            //
        }

        public string CreateEventFrame() {
            var db = InitializeAf();
            string result;
            if (db != null)
            {
                result = "connected";
                AFEventFrame myEventFrame = new AFEventFrame(db, "NewEventFrame*");
                myEventFrame.SetStartTime("T-1w");
                myEventFrame.SetEndTime(AFTime.Now);
                myEventFrame.Template = db.ElementTemplates["Сообщение"];
                AFValue myValue = new AFValue { Value = "Test" };
                myEventFrame.Attributes["Комментарий"].SetValue(myValue);
                myEventFrame.Description = "This is my EventFrame";
                myEventFrame.CheckIn();
                result += Environment.NewLine + "event frame created"; 
            }
            else
            {
                result = "disconnect";
            }

            return result;
        }

        public string GetEventFrames() {
            var db = InitializeAf();
            string result;
            if (db != null)
            {
                AFNamedCollectionList<AFEventFrame> eventFrames = AFEventFrame.FindEventFrames(db, null, "*", AFSearchField.Name, true, AFSortField.Name, AFSortOrder.Ascending, 0, 1000);
                var listEventFrames = new List<EventFrame>();
                foreach (var eventFrame in eventFrames)
                {
                    listEventFrames.Add(new EventFrame
                    {
                        Name = eventFrame.Name,
                        Id = eventFrame.ID.ToString(),
                        DateTime = eventFrame.StartTime.ToString()
                    });
                }

                var serializer = new JavaScriptSerializer();
                result = serializer.Serialize(listEventFrames);
            }
            else { result = "no db"; }

            return result;
        }
    }
}
