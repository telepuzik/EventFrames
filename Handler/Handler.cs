﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Security.Principal;
using AfHelper;

namespace Handler
{
    internal class IspHandler : IHttpHandler, IDisposable
    {
        public void Dispose() { }
        public void ProcessRequest(HttpContext httpContext) {
            //Отключение кэширования
            httpContext.Response.Clear();
            httpContext.Response.Cache.SetCacheability(HttpCacheability.Public);
            httpContext.Response.Cache.SetExpires(DateTime.MinValue);
            //

            var request = httpContext.Request.QueryString["action"];
            var AfHelper = new Helper();
            string result;
            switch (request) { 
                case "createeventframe":
                    result = AfHelper.CreateEventFrame();
                    break;
                case "geteventframes":
                    result = AfHelper.GetEventFrames();
                    break;
                default:
                    result = "no data";
                    break;
            }
            httpContext.Response.Write(result);
        }
        public bool IsReusable
        {
            get 
            {
                return false;
            }
        }
    }
}