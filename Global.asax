<%@ Application Language="C#" %>
<script RunAt="server">
    //
    void Application_Start(object sender, EventArgs e)
    {
        // Code that runs on application startup
        RegisterBundles(System.Web.Optimization.BundleTable.Bundles);
        // Force TLS 1.2 - Berker Yüceer - 06.06.2023
        System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12; // > .net 4.7
        // System.Net.ServicePointManager.SecurityProtocol = (System.Net.SecurityProtocolType)3072; // < .net 4.7
    }
    //
    public static void RegisterBundles(System.Web.Optimization.BundleCollection bundles)
    {
        #region CSS Bundles
        // Create CSS Bundles
        var bootstrapCss = new System.Web.Optimization.StyleBundle("~/css/bootstrapCss").Include("~/css/bootstrap.css");
        var mochaCss = new System.Web.Optimization.StyleBundle("~/css/mochaCss").Include("~/css/mocha.css");
        var mobilmenuCss = new System.Web.Optimization.StyleBundle("~/css/mobilmenuCss").Include("~/css/jquery.mmenu.all.css");
        var owlcarouselCss = new System.Web.Optimization.StyleBundle("~/css/owlcarouselCss").Include("~/css/owl.carousel.css");
        var fontsCss = new System.Web.Optimization.StyleBundle("~/css/fontsCss").Include("~/css/fonts.css");
        var fancyboxCss = new System.Web.Optimization.StyleBundle("~/css/fancyboxCss").Include("~/css/fancybox.css");
        var easyResTabCss = new System.Web.Optimization.StyleBundle("~/css/easyResTabCss").Include("~/css/easy-responsive-tabs.css");
        // Add CSS Bundles
        bundles.Add(bootstrapCss);
        bundles.Add(fontsCss);
        bundles.Add(mochaCss);
        bundles.Add(mobilmenuCss);
        bundles.Add(owlcarouselCss);
        bundles.Add(fancyboxCss);
        bundles.Add(easyResTabCss);
        #endregion CSS Bundles

        #region JS Bundles
        // Create Bundles
        var bootstrapJs = new System.Web.Optimization.ScriptBundle("~/Js/bootstrapJs").Include("~/js/bootstrap.js");
        var jqueryuiJs = new System.Web.Optimization.ScriptBundle("~/Js/jqueryuiJs").Include("~/js/jquery-ui.js");
        var owlcarouselJs = new System.Web.Optimization.ScriptBundle("~/Js/owlcarouselJs").Include("~/js/owl.carousel.js");
        var fancyboxJs = new System.Web.Optimization.ScriptBundle("~/Js/fancyboxJs").Include("~/js/jquery.fancybox.js");
        var modernizrJs = new System.Web.Optimization.ScriptBundle("~/Js/modernizrJs").Include("~/js/modernizr.custom.js");
        var easyResponsiveTabsJs = new System.Web.Optimization.ScriptBundle("~/Js/easyResponsiveTabsJs").Include("~/js/easyResponsiveTabs.js");
        var fullexpandcollapseJs = new System.Web.Optimization.ScriptBundle("~/Js/fullexpandcollapseJs").Include("~/js/fullexpandcollapse.js");
        var masonryJs = new System.Web.Optimization.ScriptBundle("~/Js/masonryJs").Include("~/js/masonry.js");
        var isotopeJs = new System.Web.Optimization.ScriptBundle("~/Js/isotopeJs").Include("~/js/isotope.js");
        var formJs = new System.Web.Optimization.ScriptBundle("~/Js/formJs").Include("~/js/form.js");
        var customsJs = new System.Web.Optimization.ScriptBundle("~/Js/customsJs").Include("~/js/customs.js");
        // Add Bundles
        bundles.Add(modernizrJs);
        bundles.Add(easyResponsiveTabsJs);
        bundles.Add(masonryJs);
        bundles.Add(isotopeJs);
        bundles.Add(formJs);
        bundles.Add(bootstrapJs);
        bundles.Add(owlcarouselJs);
        bundles.Add(fancyboxJs);
        bundles.Add(jqueryuiJs);
        bundles.Add(fullexpandcollapseJs);
        bundles.Add(customsJs);
        #endregion JS Bundles

        // Auto minimize?
        System.Web.Optimization.BundleTable.EnableOptimizations = true;
    }
    //
    protected void Application_PreRequestHandlerExecute(Object sender, EventArgs e)
    {
        // Code that runs on before requests are received
    }
    //
    void Application_End(object sender, EventArgs e)
    {
        // Code that runs on application shutdown
    }
    //
    void Application_Error(object sender, EventArgs e)
    {
        // Code that runs when an unhandled error occurs
    }
    //
    void Session_Start(object sender, EventArgs e)
    {
        // Code that runs when a new session is started
    }
    //
    void Session_End(object sender, EventArgs e)
    {
        // Code that runs when a session ends. 
        // Note: The Session_End event is raised only when the sessionstate mode
        // is set to InProc in the Web.config file. If session mode is set to StateServer 
        // or SQLServer, the event is not raised.
    }
    //
    void Application_BeginRequest(object sender, EventArgs e)
    {
        UrlRewrite();
        int getLang = Shared.GetLang();
        System.Threading.Thread.CurrentThread.CurrentCulture = new System.Globalization.CultureInfo(getLang.toLangCulture());

        string requestUrl = HttpContext.Current.Request.Url.AbsolutePath.ToLower();

        //if (requestUrl.StartsWith("/WebServices/ClientServices.asmx/VerifyToken", StringComparison.OrdinalIgnoreCase))
        //{
        //    return;
        //}

        //if (!requestUrl.StartsWith("/security", StringComparison.OrdinalIgnoreCase) || !requestUrl.StartsWith("/security", StringComparison.OrdinalIgnoreCase))
        //{
        //    string cookieName = "cfv";
        //    string cookieValue = "true";

        //    // İstekteki cookie'yi kontrol et
        //    var cookie = HttpContext.Current.Request.Cookies[cookieName];
        //    if (cookie == null || cookie.Value != cookieValue)
        //    {
        //        HttpContext.Current.Response.Redirect("~/security");
        //        return;
        //    }
        //}
        //if (requestUrl.StartsWith("/security"))
        //{
        //    string cookieName = "cfv";
        //    var cookieValue = HttpContext.Current.Request.Cookies[cookieName];
        //    if (cookieValue != null)
        //    {
        //        if (cookieValue.Value == "true")
        //        {
        //            HttpContext.Current.Response.Redirect("/");
        //            return;
        //        }

        //    }
        //}
    }
    //
    public void UrlRewrite()
    {
        MvcXmlEntities ConnXml = new MvcXmlEntities();
        string Url = Request.RawUrl.Substring(1);
        string QueryUrl = "";
        string host = HttpContext.Current.Request.Url.Host.ToLower();
        if (host == "192.168.0.118")
        {
            Url = Url.Replace(Shared.PageBaseLocalPath(), "");
        }
        //
        if (Url.Contains("?"))
        {
            QueryUrl = Url.Split('?')[1].ToString();
            Url = Url.Split('?')[0].ToString();
        }
        // Url Rewrite problemi - Berker Yüceer - 12.05.2023
        if (Url != "")
        {
            if (Url.Substring(Url.Length - 1, 1) == "/")
            {
                Url = Url.Substring(0, Url.Length - 1);
            }
        }
        // 
        if (ConnXml.vwUrlList.Any(x => x.RawUrl == Url))
        {
            vwUrlList getUrlList = ConnXml.vwUrlList.FirstOrDefault(x => x.RawUrl == Url);
            Context.RewritePath("~/" + getUrlList.LinkUrl + (QueryUrl != "" ? "&" + QueryUrl : ""), true);
            // Context.RewritePath(getUrlList.LinkUrl, true);
        }
    }
</script>
