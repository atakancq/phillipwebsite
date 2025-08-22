using System;
using System.Linq;
using System.Web;
//
public static class Pager
{
    private static int PageNumber;
    private static double TotalRecord;
    private static double TotalPageNumber;
    private static string PgParam = "?Page=";
    public static int PageLimit;
    public static int SkipCount;
    public static int SelectedPage;
    //
    public static int GetPageNumber()
    {
        if (HttpContext.Current.Request.QueryString["Page"] != null)
        {
            string Page = HttpContext.Current.Request.QueryString["Page"].ToString().Replace("=","");
            if (Shared.IsNumeric(Page))
            {
                return int.Parse(Page);
            }
            else
                return 1;
        }
        else
            return 1;
    }
    //
    public static IQueryable<T> Paging<T>(this IQueryable<T> List, int Limit) where T : class
    {
        TotalRecord = List.Count();
        PageLimit = Limit;
        SelectedPage = GetPageNumber(); // Seçili sayfayı buradan gönderiyoruz, güvenlik için
        PageNumber = SelectedPage - 1;
        if (TotalRecord > PageLimit)
        {
            TotalPageNumber = Math.Ceiling(TotalRecord / PageLimit);
            if (TotalPageNumber > PageNumber)
            {
                SkipCount = PageLimit * PageNumber;
                return List.Skip(SkipCount).Take(PageLimit);
            }
            else
            {
                // Sayfa numarası toplam sayfa sayısından yüksek ise son sayfa seçili yapılır
                SelectedPage = (int)TotalPageNumber;
                SkipCount = PageLimit * (SelectedPage - 1);
                return List.Skip(SkipCount).Take(PageLimit);
            }
        }
        return List.Take(Limit);
    }
    //
    public static string Control()
    {
        string ControlBuilder = "";
        if (TotalPageNumber > 1)
        {
            //ControlBuilder +="  <div class=\"Paging\">";
            //if (SelectedPage > 1)
            //{
                //ControlBuilder += string.Format(@"<div class='PageLeft'><a href='{0}'><img src='images/paging-left.png'></a></div>", GetUrl(SelectedPage - 1));
            //}
            //ControlBuilder += "<ul>";
            for (int i = 1; i <= TotalPageNumber; i++)
            {
                ControlBuilder += string.Format(@"<li><a {2} href='{0}'>{1}</a></li>", (GetUrl(i)), i, (i == SelectedPage ? "class='Selected'" : ""));
            }
            //ControlBuilder += "</ul>";
            //if (SelectedPage < TotalPageNumber)
            //{
                //ControlBuilder += string.Format(@"<div class='PageRight'><a href='{0}'><img src='images/paging-right.png'></a> </div>", GetUrl(SelectedPage + 1));
            //}
            //ControlBuilder += "</div>";
        }
        Refresh();
        return ControlBuilder;
    }
    //
    public static string Control2()
    {
        string ControlBuilder = "";
        if (TotalPageNumber > 1)
        {
            //ControlBuilder +="  <div class=\"Paging\">";
            //if (SelectedPage > 1)
            //{
            //ControlBuilder += string.Format(@"<div class='PageLeft'><a href='{0}'><img src='images/paging-left.png'></a></div>", GetUrl(SelectedPage - 1));
            //      }
            //ControlBuilder += "<ul>";
            for (int i = 1; i <= TotalPageNumber; i++)
            {
                ControlBuilder += string.Format(@"<a {2} href='{0}'>{1}</a>", (GetUrl(i)), i, (i == SelectedPage ? "class='Selected'" : ""));
            }
            //ControlBuilder += "</ul>";
            //if (SelectedPage < TotalPageNumber)
            //{
            //ControlBuilder += string.Format(@"<div class='PageRight'><a href='{0}'><img src='images/paging-right.png'></a> </div>", GetUrl(SelectedPage + 1));
            //  }
            //ControlBuilder += "</div>";
        }
        Refresh();
        return ControlBuilder;
    }
    //
    private static string GetUrl(int _SelectedPage)
    {
        string ControlUrl = "";
        if (HttpContext.Current.Request.QueryString["Page"] != null)
        {
            string QueryStringValue = HttpContext.Current.Request.QueryString["Page"].ToString();
            string Query1 =  Shared.FixupUrl().Substring(0, Shared.FixupUrl().IndexOf("Page=") );
            string Query2 = (Shared.FixupUrl().Substring(Shared.FixupUrl().IndexOf("Page=") + 4, (Shared.FixupUrl().Length) - (Shared.FixupUrl().IndexOf("Page=") + 6)));
            string Query = Query1 + "Page=" + _SelectedPage;
            //HttpContext.Current.Response.Write("<br>"+Query2+"<br>");
            ControlUrl = Query;
        }
        else
        {
            if (Shared.FixupUrl().Contains("?") && Shared.FixupUrl().Contains("="))
            {
                ControlUrl = Shared.FixupUrl() + PgParam.Replace("?", "&") + _SelectedPage;
            }
            else
            {
                if (Shared.FixupUrl().Contains("?"))
                {
                    ControlUrl = Shared.FixupUrl() + PgParam.Replace("?","") + _SelectedPage;
                }
                else
                {
                    ControlUrl = Shared.FixupUrl() + PgParam + _SelectedPage;
                }
            }
        }
        return ControlUrl;
    }
    //
    public static void Refresh()
    {
        PageNumber = 0;
        TotalRecord = 0;
        TotalPageNumber = 0;
        PageLimit = 0;
        SkipCount = 0;
        SelectedPage = 0;
    }
}