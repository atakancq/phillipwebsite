using System.Linq;
//
public static class GetSeoUrl
{
    //
    public static string getPagesUrl(int reqPageID)
    {
        MvcXmlEntities ConnXml = new MvcXmlEntities();
        string resUrl = "";
        Pages itemPages = ConnXml.Pages.FirstOrDefault(x => x.PageID == reqPageID);
        if (itemPages != null)
        {
            resUrl = itemPages.RawUrl;
        }
        return resUrl;
    }
    //
    public static string getNewsUrl(int reqPageID)
    {
        MvcXmlEntities ConnXml = new MvcXmlEntities();
        string resUrl = "";
        News itemPages = ConnXml.News.FirstOrDefault(x => x.NewsID == reqPageID);
        string[] Type = { "Haberler", "News" };
        if (itemPages.Lang.toSeoLanguage())
        {
            resUrl = Shared.PageBasePath() + Type[itemPages.Lang] + "/" + itemPages.Title.ConvertToUrl() + "/" + itemPages.NewsID;
        }
        else
        {
            resUrl = Shared.PageBasePath() + Type[itemPages.Lang] + "/" + itemPages.NewsID + "/" + itemPages.NewsID;
        }
        return resUrl;
    }
    //
    public static string getEventsUrl(int reqPageID)
    {
        MvcXmlEntities ConnXml = new MvcXmlEntities();
        string resUrl = "";
        Events itemPages = ConnXml.Events.FirstOrDefault(x => x.EventsID == reqPageID);
        string[] Type = { "Etkinlikler", "Events" };
        if (itemPages.Lang.toSeoLanguage())
        {
            resUrl = Shared.PageBasePath() + Type[itemPages.Lang] + "/" + itemPages.Title.ConvertToUrl() + "/" + itemPages.EventsID;
        }
        else
        {
            resUrl = Shared.PageBasePath() + Type[itemPages.Lang] + "/" + itemPages.EventsID + "/" + itemPages.EventsID;
        }
        return resUrl;
    }
}