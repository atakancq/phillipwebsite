using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Reflection;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.WebPages.Html;

public static class Shared
{
    // 
    public static bool ValidPhone(string phone)
    {
        string pattern = @"^0 \(\d{3}\) \d{3} \d{4}$";

        bool valid = Regex.IsMatch(phone, pattern);

        return valid;
    }
    public static bool IsArabic(string text)
    {
        // Arapça karakterlerin Unicode aralığı
        // (\u0600 - \u06FF) genel Arapça karakterler
        // (\u0750 - \u077F) genişletilmiş Arapça karakterler
        // (\u08A0 - \u08FF) Arapça kenar karakterleri
        // (\uFB50 - \uFDFF) Arapça sunum formları-A
        // (\uFE70 - \uFEFF) Arapça sunum formları-B
        string pattern = @"\p{IsArabic}";

        return Regex.IsMatch(text, pattern);
    }

    public static bool IsPhoneNumber(string number)
    {
        return Regex.Match(number, @"^0?5\d{9}$").Success;
    }
    public static string ToFormBody(string[] Name, string[] Value)
    {
        string rtr = "";
        for (int i = 0; i < Name.Length; i++)
        {
            rtr += Name[i] + " : " + Value[i] + "<br /><br />";
        }
        return rtr;
    }
    //
    public static string PageUrl = FixupUrl();
    //
    public static string FixupUrl() { return  HttpContext.Current.Request.Url.AbsoluteUri; }
    //
    public static void PageRefresh()
    {
        HttpContext.Current.Response.Redirect(Shared.FixupUrl());
    }
    //
    public static string PageBaseLocalPath()
    {
        string basePathString = string.Format("{0}", HttpContext.Current.Request.ApplicationPath).Substring(1);
        return basePathString + (basePathString.EndsWith("/") ? "" : "/");
    }
    //
    public static int toInt(this object obj)
    {
        int ID = 0;
        try
        {
            ID = Shared.IsNumeric(obj.ToString()) ? int.Parse(obj.ToString()) : 0;
        }
        catch { }
        return ID;
    }
    //
    public static void Refresh() { HttpContext.Current.Response.Redirect(HttpContext.Current.Request.Url.ToString(), true); }
    //
    public static string RandomName() { return FormsAuthentication.HashPasswordForStoringInConfigFile(System.Guid.NewGuid().ToString(), "md5").Substring(0, 10); }
    //
    public static string PageNameQ() { return System.IO.Path.GetFileName(HttpContext.Current.Request.Url.AbsoluteUri); }
    //
    public static string PageName() { return System.IO.Path.GetFileName(HttpContext.Current.Request.CurrentExecutionFilePath); }
    //
    public static string PageBasePath()
    {
        string basePathString = string.Format("{0}://{1}{2}", HttpContext.Current.Request.Url.Scheme, HttpContext.Current.Request.Url.Authority, HttpContext.Current.Request.ApplicationPath);
        return basePathString + (basePathString.EndsWith("/") ? "" : "/");
    }
    //
    public static bool IsNumeric(string str) { try { Int64.Parse(str); } catch { return false; } return true; }
    //
    public static string UppercaseFirstLetter(this string str)
    {
        string formatted = System.Threading.Thread.CurrentThread.CurrentCulture.TextInfo.ToTitleCase(str.ToLower());
        return formatted;
    }
    //
    public static List<SelectListItem> lstViewType()
    {
        List<SelectListItem> lstVideo = new List<SelectListItem>();
        lstVideo.Add(new SelectListItem { Text = "Gösterim Tipi Seçiniz", Value = "0" });      
        lstVideo.Add(new SelectListItem { Text = "Metin", Value = "1" });
        lstVideo.Add(new SelectListItem { Text = "Resim", Value = "2" });
        return lstVideo;
    }
    //
    public static string ConvertToUrl(this string str)
    {
        try
        {
            str = str.Trim();
            str = Regex.Replace(str, "ş", "s");
            str = Regex.Replace(str, "ı", "i");
            str = Regex.Replace(str, "ö", "o");
            str = Regex.Replace(str, "ü", "u");
            str = Regex.Replace(str, "ç", "c");
            str = Regex.Replace(str, "ğ", "g");
            str = Regex.Replace(str, "Ş", "S");
            str = Regex.Replace(str, "İ", "I");
            str = Regex.Replace(str, "Ö", "O");
            str = Regex.Replace(str, "Ü", "U");
            str = Regex.Replace(str, "Ç", "C");
            str = Regex.Replace(str, "Ğ", "G");
            str = Regex.Replace(str, " ", "-");
            str = Regex.Replace(str, "[^A-Za-z0-9/_-]", "");
        }
        catch
        {
            str = "";
        }
        return HttpContext.Current.Server.UrlPathEncode(str);
    }
    //
    public static string nl2br(this string str) { return str.Replace("\r\n", "<br />"); }
    //
    public static string textLenControl(this string str, int max) { return str.Length < max ? str : str.Substring(0, max) + "..."; }
    //
    public static string toHighlight(this string obj)
    {
        if (HttpContext.Current.Request.QueryString["hl"] != null && obj.Length > 0)
        {
            obj = Regex.Replace(obj, "(" + Regex.Escape(HttpContext.Current.Request.QueryString["hl"]) + ")", "<span class='highlight'>$1</span>", RegexOptions.IgnoreCase);
        }
        return obj;
    }
    //
    public static string DetailFormat = "<tr><td class='Normal'>{0}</td><td>{1}</td></tr>";
    //
    public static string[] LangColor = { "#000", "#298BB9" };
    //
    public static string toLangColor(this int i) { return LangColor[i]; }
    //
    public static string[] Lang = { "Türkçe", "English" };
    //
    public static string toLang(this int i) { return Lang[i]; }
    //
    public static string[] LangCulture = { "tr-TR", "en-US" };
    //
    public static string toLangCulture(this int i) { return LangCulture[i]; }
    //
    static string[] LangRelease = { "Sayfalar", "Pages" };
    //
    public static string toLangRelease(this int i) { return LangRelease[i]; }
    //
    static string[] LangHomeName = { "Anasayfa", "Homepage" };
    //
    public static string toLangHomeName(this int i) { return LangHomeName[i]; }
    //
    static string[] LangHome = { "TR", "EN"};
    //
    public static string toLangHome(this int i) { return LangHome[i]; }
    //
    static string[] LangImage = { "Turkish.jpg", "English.jpg" };
    //
    public static string toLangImage(this int i) { return LangImage[i]; }
    //
    public static string[] PageType = { "Standart","Menüsüz", "Açılış Sayfası" };
    //
    public static string[] PageTypeUrl = { "Page", "NonMenuPage", "LandingPage" };
    //
    static bool[] isSeoLanguage = { true, true,false };
    //
    public static bool toSeoLanguage(this int i) { return isSeoLanguage[i]; }
    //
    public static string toPageType(this int i) { return PageType[i]; }
    //
    public static string toPageTypeUrl(this int i) { return PageTypeUrl[i]; }
    //
    public static void toPageType(this DropDownList drp) { for (int i = 0; i < PageType.Length; i++) { ListItem Item = new ListItem(PageType[i], i.ToString()); drp.Items.Add(Item); } }
    //
    public static void toPageType(this RadioButtonList drp) { for (int i = 0; i < PageType.Length; i++) { ListItem Item = new ListItem(PageType[i], i.ToString()); drp.Items.Add(Item); } }
    //
    public static void toPageType(this CheckBoxList drp) { for (int i = 0; i < PageType.Length; i++) { ListItem Item = new ListItem(PageType[i], i.ToString()); drp.Items.Add(Item); } }
    //
    public static void toLang(this DropDownList drp)
    {
        for (int i = 0; i < Lang.Length; i++)
        {
            ListItem Item = new ListItem(Lang[i], i.ToString()); Item.Attributes.CssStyle.Add("color", i.toLangColor()); drp.Items.Add(Item);
        }
    }
    //
    public static void toLang(this RadioButtonList drp) { for (int i = 0; i < Lang.Length; i++) { ListItem Item = new ListItem(Lang[i], i.ToString()); Item.Attributes.CssStyle.Add("color", i.toLangColor()); drp.Items.Add(Item); } }
    //
    public static void toLang(this CheckBoxList drp) { for (int i = 0; i < Lang.Length; i++) { ListItem Item = new ListItem(Lang[i], i.ToString()); Item.Attributes.CssStyle.Add("color", i.toLangColor()); drp.Items.Add(Item); } }
    //
    public static string toBoolString(this bool i) { return (i ? "Evet" : "Hayır"); }
    //
    static string[] Status = { "Pasif", "Aktif" };
    //
    public static string toStatus(this int i) { return Status[i]; }
    //
    public static void toStatus(this DropDownList drp) { for (int i = 0; i < Status.Length; i++) { drp.Items.Add(new ListItem(Status[i], i.ToString())); } }
    //
    public static void toStatus(this RadioButtonList drp) { for (int i = 0; i < Status.Length; i++) { drp.Items.Add(new ListItem(Status[i], i.ToString())); drp.SelectedValue = "1"; } }
    //
    public static void toStatus(this CheckBoxList drp) { for (int i = 0; i < Status.Length; i++) { drp.Items.Add(new ListItem(Status[i], i.ToString())); drp.SelectedValue = "1"; } }
    //
    static string[] HistoryType = { "Eklendi", "Düzenlendi", "Silindi" };
    //
    public static string toHistoryType(this int i) { return HistoryType[i]; }
    //
    static string[] PhotoGaleryFileType = { "Resim", "Flash" };
    //
    public static string toPhotoGaleryFileType(this int i)
    {
        return PhotoGaleryFileType[i];
    }
    //
    public static void toPhotoGaleryFileType(this DropDownList drp)
    {
        for (int i = 0; i < PhotoGaleryFileType.Length; i++)
        {
            drp.Items.Add(new ListItem(PhotoGaleryFileType[i], i.ToString()));
        }
    }
    //
    public static string md5(this string str)
    {
        return FormsAuthentication.HashPasswordForStoringInConfigFile(str, "md5");
    }
    //
    public static int GetEnumIndex(Enum name)
    {
        int i = 0;
        foreach (string _name in System.Enum.GetNames(name.GetType()))
        {
            if (_name == name.ToString())
            {
                return i;
            }
            i++;
        }
        return 0;
    }
    public static bool ValidNameSurname(string adSoyad)
    {
        // Boş mu, uzunluğu uygun mu kontrol et
        if (string.IsNullOrWhiteSpace(adSoyad) || adSoyad.Length < 3)
            return false;

        string pattern = @"^[a-zA-ZçÇğĞıİöÖşŞüÜ]+([\s][a-zA-ZçÇğĞıİöÖşŞüÜ]+)*$";
        return Regex.IsMatch(adSoyad, pattern);
    }
    public static int GetLang()
    {
        return (HttpContext.Current.Request.QueryString["Lang"] != null ? int.Parse(HttpContext.Current.Request.QueryString["Lang"]) : 0);
    }
    //

    public static void SendMail(string alici, string konu, string icerik, string path = "")
    {
        try
        {
            // Gönderen bilgisi
            var gonderen = new MailAddress("info@phillipcapital.org", "Bilgi - PhillipCapital");
            var aliciAdres = new MailAddress(alici);

            // Mail oluştur
            var mesaj = new MailMessage(gonderen, aliciAdres)
            {
                Subject = konu,
                Body = icerik,
                IsBodyHtml = true // HTML içeriği destekliyorsa true
            };

            // SMTP ayarları
            var smtp = new SmtpClient
            {
                Host = "mail.phillipcapital.org",
                Port = 25,
                EnableSsl = false,
                Credentials = new NetworkCredential("info@phillipcapital.org", "!!Phc44**")
            };

            if (!string.IsNullOrEmpty(path) && File.Exists(path))
            {
                Attachment ek = new Attachment(path);
                mesaj.Attachments.Add(ek);
            }

            smtp.Send(mesaj);
            Console.WriteLine("Mail gönderildi.");
        }
        catch (Exception ex)
        {
            Console.WriteLine("Mail gönderme hatası: " + ex.Message);
        }
    }
    public static bool TCIdentityConfirm(string tcKimlikNo)
    {
        bool returnvalue = false;
        if (tcKimlikNo.Length == 11)
        {
            Int64 ATCNO, BTCNO, TcNo;
            long C1, C2, C3, C4, C5, C6, C7, C8, C9, Q1, Q2;
            TcNo = Int64.Parse(tcKimlikNo);
            ATCNO = TcNo / 100;
            BTCNO = TcNo / 100;
            C1 = ATCNO % 10; ATCNO = ATCNO / 10;
            C2 = ATCNO % 10; ATCNO = ATCNO / 10;
            C3 = ATCNO % 10; ATCNO = ATCNO / 10;
            C4 = ATCNO % 10; ATCNO = ATCNO / 10;
            C5 = ATCNO % 10; ATCNO = ATCNO / 10;
            C6 = ATCNO % 10; ATCNO = ATCNO / 10;
            C7 = ATCNO % 10; ATCNO = ATCNO / 10;
            C8 = ATCNO % 10; ATCNO = ATCNO / 10;
            C9 = ATCNO % 10; ATCNO = ATCNO / 10;
            Q1 = ((10 - ((((C1 + C3 + C5 + C7 + C9) * 3) + (C2 + C4 + C6 + C8)) % 10)) % 10);
            Q2 = ((10 - (((((C2 + C4 + C6 + C8) + Q1) * 3) + (C1 + C3 + C5 + C7 + C9)) % 10)) % 10);
            returnvalue = ((BTCNO * 100) + (Q1 * 10) + Q2 == TcNo);
        }
        return returnvalue;
    }
    //
    public static string IsImage(string Path, string FileName) { if (System.IO.File.Exists(HttpContext.Current.Server.MapPath("~/" + Path + "/" + FileName))) { return FileName; } else { return "NoImage.jpg"; } }
    //
    public static string[] ZodiacDescription = { "Oğlak", "Kova", "Balık", "Koç", "Boğa", "İkizler", "Yengeç", "Aslan", "Başak", "Terazi", "Akrep", "Yay" };
    //
    public static int Zodiac(DateTime dt)
    {
        int Month = dt.Month;
        int Day = dt.Day;
        if ((Month == 12 && Day >= 23) || (Month == 1 && Day <= 20)) { return 0; }
        else if ((Month == 1 && Day >= 21) || (Month == 2 && Day <= 19)) { return 1; }
        else if ((Month == 2 && Day >= 20) || (Month == 3 && Day <= 20)) { return 2; }
        else if ((Month == 3 && Day >= 21) || (Month == 4 && Day <= 20)) { return 3; }
        else if ((Month == 4 && Day >= 21) || (Month == 5 && Day <= 21)) { return 4; }
        else if ((Month == 5 && Day >= 22) || (Month == 6 && Day <= 21)) { return 5; }
        else if ((Month == 6 && Day >= 22) || (Month == 7 && Day <= 23)) { return 6; }
        else if ((Month == 7 && Day >= 24) || (Month == 8 && Day <= 23)) { return 7; }
        else if ((Month == 8 && Day >= 24) || (Month == 9 && Day <= 23)) { return 8; }
        else if ((Month == 9 && Day >= 24) || (Month == 10 && Day <= 22)) { return 9; }
        else if ((Month == 10 && Day >= 23) || (Month == 11 && Day <= 22)) { return 10; }
        else if ((Month == 11 && Day >= 23) || (Month == 12 && Day <= 22)) { return 11; }
        return 0;
    }
    //
    public static void AddLiteral(this ControlCollection Control, object str)
    {
        Control.Add(new LiteralControl(str.ToString()));
    }
    //
    public static string ClearHtml(this string veri)
    {
        return Regex.Replace(veri, @"<(.|\n)*?>", string.Empty);
    }
    //
    public static string GetTranslation(int reqLanguageWordID)
    {
        string str = "";
        MvcXmlEntities ConnXml = new MvcXmlEntities();
        try
        {
            int pageLang = Shared.GetLang();
            str = ConnXml.LanguageWordValue.FirstOrDefault(x => x.LanguageWordID == reqLanguageWordID && x.Lang == pageLang).Value;
        }
        catch
        {
            str = "Çeviri Bulunamadı";
        }
        return str;
    }
    //
    public static Boolean isMobile()
    {
        HttpContext curcontext = HttpContext.Current;
        string user_agent = curcontext.Request.ServerVariables["HTTP_USER_AGENT"];
        // Checks the user-agent
        if (user_agent != null)
        {
            user_agent = user_agent.ToLower();
            // Checks if its a Windows browser but not a Windows Mobile browser
            if (user_agent.Contains("windows") && !user_agent.Contains("windows ce"))
            {
                return false;
            }
            if (user_agent.Contains("blackberry") || user_agent.Contains("mobile") ||
                user_agent.Contains("windows ce") || user_agent.Contains("opera mini") || user_agent.Contains("iphone") ||
                user_agent.Contains("palm") || user_agent.Contains("samsung") || user_agent.Contains("htc"))
            {
                return true;
            }
            // Checks if it is a mobile browser
            string pattern = "up.browser|up.link|windows ce|iphone|iemobile|mini|mmp|symbian|midp|wap|phone|pocket|mobile|pda|psp";
            MatchCollection mc = Regex.Matches(user_agent, pattern, RegexOptions.IgnoreCase);
            if (mc.Count > 0)
                return true;
            // Checks if the 4 first chars of the user-agent match any of the most popular user-agents
            string popUA = "|acs-|alav|alca|amoi|audi|aste|avan|benq|bird|blac|blaz|brew|cell|cldc|cmd-|dang|doco|eric|hipt|inno|ipaq|java|jigs|kddi|keji|leno|lg-c|lg-d|lg-g|lge-|maui|maxo|midp|mits|mmef|mobi|mot-|moto|mwbp|nec-|newt|noki|opwv|palm|pana|pant|pdxg|phil|play|pluc|port|prox|qtek|qwap|sage|sams|sany|sch-|sec-|send|seri|sgh-|shar|sie-|siem|smal|smar|sony|sph-|symb|t-mo|teli|tim-|tosh|tsm-|upg1|upsi|vk-v|voda|w3c |wap-|wapa|wapi|wapp|wapr|webc|winw|winw|xda|xda-|";
            if (popUA.Contains("|" + user_agent.Substring(0, 4) + "|"))
                return true;
        }
        // Checks the accept header for wap.wml or wap.xhtml support
        string accept = curcontext.Request.ServerVariables["HTTP_ACCEPT"];
        if (accept != null)
        {
            if (accept.Contains("text/vnd.wap.wml") || accept.Contains("application/vnd.wap.xhtml+xml"))
            {
                return true;
            }
        }
        // Checks if it has any mobile HTTP headers
        string x_wap_profile = curcontext.Request.ServerVariables["HTTP_X_WAP_PROFILE"];
        string profile = curcontext.Request.ServerVariables["HTTP_PROFILE"];
        string opera = curcontext.Request.Headers["HTTP_X_OPERAMINI_PHONE_UA"];
        if (x_wap_profile != null || profile != null || opera != null)
        {
            return true;
        }
        return false;
    }
    //
    public static string GetIpAddress()
    {
        using (WebClient webClient = new WebClient())
        {
            string externalIpString = webClient.DownloadString("http://icanhazip.com").Replace("\\r\\n", "").Replace("\\n", "").Trim();
            var externalIp = IPAddress.Parse(externalIpString);
            return externalIp.ToString();
        }
    }
    //
    public static T Cast<T>(this Object myobj)
    {
        Type objectType = myobj.GetType();
        Type target = typeof(T);
        var x = Activator.CreateInstance(target, false);
        var z = from source in objectType.GetMembers().ToList()
                where source.MemberType == MemberTypes.Property
                select source;
        var d = from source in target.GetMembers().ToList()
                where source.MemberType == MemberTypes.Property
                select source;
        List<MemberInfo> members = d.Where(memberInfo => d.Select(c => c.Name)
           .ToList().Contains(memberInfo.Name)).ToList();
        PropertyInfo propertyInfo;
        object value;
        foreach (var memberInfo in members)
        {
            propertyInfo = typeof(T).GetProperty(memberInfo.Name);
            if (myobj.GetType().GetProperty(memberInfo.Name) != null)
            {
                value = myobj.GetType().GetProperty(memberInfo.Name).GetValue(myobj, null);
                propertyInfo.SetValue(x, value, null);
            }
        }
        return (T)x;
    }
    //
    public static bool ReCaptchaPassed(string gRecaptchaResponse)
    {
        WebClient client = new WebClient();
        var res = client.OpenRead("https://www.google.com/recaptcha/api/siteverify?secret=6Lf6f6YnAAAAAKqLo5z6362hURRyptEnRdpQgCeR&response=" + gRecaptchaResponse);
        StreamReader reader = new StreamReader(res);
        string s = reader.ReadToEnd();
        dynamic json = JsonConvert.DeserializeObject(s);
        if (json.success != "true" || json.score <= 0.5m)
        {
            return false;
        }
        return true;
    }

    public static bool EmailIsValid(string email)
    {
        string expression = "\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*";

        if (email.Length <= 320 &&  Regex.IsMatch(email, expression))
        {
            if (Regex.Replace(email, expression, string.Empty).Length == 0)
            {
                return true;
            }
        }
        return false;
    }

}
