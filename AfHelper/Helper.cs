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

    public class Attribute {
        public string Name { get; set; }
        public string Value { get; set; }
    }

    public class AttributeString : Attribute {
        public string Name { get; set; }
        public string Type { get; set; }
        public string Value { get; set; }
        public bool Constant { get; set; }
        public bool Required { get; set; }
    }

    public class AttributeList: Attribute
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public string Value { get; set; }
        public List<string> ValueSet { get; set; }
        public bool Constant { get; set; }
        public bool Required { get; set; }
    }

    public class AttributeDictionary : Attribute
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public string Value { get; set; }
        public List<DictionaryValueSet> ValueSet { get; set; }
        public bool Constant { get; set; }
        public bool Required { get; set; }
    }

    public class DictionaryValueSet {
        public string Id { get; set; }
        public string Name { get; set; }
    }

    public class Template {
        public string Id { get; set; }
        public string Name { get; set; }
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
            var eventFrame = new EventFrame();
            if (db != null)
            {
                AFEventFrame myEventFrame = new AFEventFrame(db, "NewEventFrame*");
                myEventFrame.SetStartTime("T-1w");
                myEventFrame.SetEndTime(AFTime.Now);
                myEventFrame.Template = db.ElementTemplates["Сообщение"];
                AFValue myValue = new AFValue { Value = "Test" };
                myEventFrame.Attributes["Текст сообщения"].SetValue(myValue);
                myEventFrame.Description = "This is my EventFrame";
                myEventFrame.CheckIn();

                eventFrame.Id = myEventFrame.ID.ToString();
                eventFrame.Name = myEventFrame.Name;
                eventFrame.DateTime = myEventFrame.EndTime.ToString();
                var serializer = new JavaScriptSerializer();
                result = serializer.Serialize(eventFrame);
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
                        DateTime = eventFrame.EndTime.ToString()
                    });
                }

                var serializer = new JavaScriptSerializer();
                result = serializer.Serialize(listEventFrames);
            }
            else { result = "no db found"; }

            return result;
        }

        public string GetEventFrame (string Id) {
            var db = InitializeAf();
            string result;
            Guid guid = new Guid(Id);
            AFEventFrame eventFrame = AFEventFrame.FindEventFrame(db.PISystem, guid);

            var attributes = eventFrame.Attributes;
            var attributesList = new List<AttributeString>();
            foreach (var attribute in attributes) {
                if (attribute.Attributes.Count > 0) {
                    var att = attribute.Attributes;
                }
                var a = new AttributeString
                {
                    Name = attribute.Name,
                    Type = attribute.Type.ToString()
                };
                if (attribute.GetValue().Value != null)
                {
                    a.Value = attribute.GetValue().Value.ToString();
                }
                attributesList.Add(a);
            }

            var serializer = new JavaScriptSerializer();
            result = serializer.Serialize(attributesList);
            return result;
        }

        public string GetEventFrameTemplates() { 
            var db = InitializeAf();
            string result;

            var templates = db.ElementTemplates;
            var templatesList = new List<Template>();
            foreach (var template in templates)
            {
                if (template.InstanceType.FullName == "OSIsoft.AF.EventFrame.AFEventFrame")
                {
                    var t = new Template
                    {
                        Id = template.ID.ToString(),
                        Name = template.Name.ToString()
                    };

                    templatesList.Add(t);
                }
            }
            var serializer = new JavaScriptSerializer();
            result = serializer.Serialize(templatesList);
            return result;
        }

        public string GetEventFrameTemplate(string Id) {
            var db = InitializeAf();
            string result;

            var templates = db.ElementTemplates;
            var attributesList = new List<Attribute>();
            foreach (var template in templates)
            {
                if (template.InstanceType.FullName == "OSIsoft.AF.EventFrame.AFEventFrame")
                {
                    if (template.ID.ToString() == Id)
                    {
                        var attributes = template.AttributeTemplates;
                        foreach (var attribute in attributes)
                        {
                            string type = String.Empty;
                            string value = String.Empty;
                            bool constant = false;
                            bool required = false;
                            if (attribute.AttributeTemplates["TYPE"] != null)
                            {
                                if (attribute.AttributeTemplates["TYPE"].GetValue(null) != null)
                                {
                                    type = attribute.AttributeTemplates["TYPE"].GetValue(null).ToString();
                                }
                            }
                            if (attribute.AttributeTemplates["VALUE"] != null)
                            {
                                if (attribute.AttributeTemplates["VALUE"].GetValue(null) != null)
                                {
                                    value = attribute.AttributeTemplates["VALUE"].GetValue(null).ToString();
                                }
                            }
                            if (attribute.AttributeTemplates["CONSTANT"] != null)
                            {
                                if (attribute.AttributeTemplates["CONSTANT"].GetValue(null) != null)
                                {
                                    constant = Convert.ToBoolean(attribute.AttributeTemplates["CONSTANT"].GetValue(null).ToString());
                                }
                            }
                            if (attribute.AttributeTemplates["REQUIRED"] != null)
                            {
                                if (attribute.AttributeTemplates["REQUIRED"].GetValue(null) != null)
                                {
                                    required = Convert.ToBoolean(attribute.AttributeTemplates["REQUIRED"].GetValue(null).ToString());
                                }
                            }
                            
                            switch (type) {
                                case "List":
                                    var b = new AttributeList
                                    {
                                        Name = attribute.Name,
                                        Type = type,
                                        Value = value,
                                        Constant = constant,
                                        Required = required
                                    };
                                    b.ValueSet = new List<string>();
                                    var elementValueSet = (AFEnumerationSet)attribute.AttributeTemplates["VALUE"].TypeQualifier;
                                    if (elementValueSet != null)
                                    {
                                        foreach (var currentValueInSet in elementValueSet)
                                        {
                                            b.ValueSet.Add(currentValueInSet.Name.ToString());
                                        }
                                    }

                                    attributesList.Add(b);
                                    break;
                                    
                                case "Dictionary":
                                    var c = new AttributeDictionary
                                    {
                                        Name = attribute.Name,
                                        Type = type,
                                        Value = value,
                                        Constant = constant,
                                        Required = required
                                    };

                                    var el = (AFElement)attribute.AttributeTemplates["VALUE"].GetValue(null);
                                    var valueSet = el.Elements.Select(currentValueInSet =>
                                        new DictionaryValueSet { Id = currentValueInSet.ID.ToString(), Name = currentValueInSet.Name }).ToList();
                                    c.ValueSet = valueSet;
                                    attributesList.Add(c);
                                    break;
                                default:
                                    var a = new AttributeString
                                    {
                                        Name = attribute.Name,
                                        Type = type,
                                        Value = value,
                                        Constant = constant,
                                        Required = required
                                    };
        
                                    attributesList.Add(a);
                                    break;
                            }
                        }
                    }
                }
            }

            var serializer = new JavaScriptSerializer();
            result = serializer.Serialize(attributesList);
            return result;
        }

        public string GetDictionaryFields(string Id) {
            var db = InitializeAf();
            string result;

            Guid currentGuid;
            try
            {
                currentGuid = new Guid(Id);
            }
            catch (Exception)
            {
                return "[]";
            }

            //Поиск элементов по адресу в rootFolder
            var currentElement = AFElement.FindElement(db.PISystem, currentGuid);
            var attributesList = new List<Attribute>();
            foreach (AFAttribute attribute in currentElement.Attributes) {
                var a = new Attribute
                {
                    Name = attribute.Name,
                    Value = attribute.GetValue().Value.ToString()
                };
                attributesList.Add(a);
            }
            var serializer = new JavaScriptSerializer();
            result = serializer.Serialize(attributesList);
            return result;
        }
    }
}