using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Runtime.Remoting.Messaging;
using System.Web.Script.Services;
using System.Web.Services;

/// <summary>
/// Summary description for ClientServices
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
[System.Web.Script.Services.ScriptService]
// To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line.  
public class ClientServices : WebService
{

    public ClientServices()
    {

        //Uncomment the following line if using designed components 
        //InitializeComponent(); 
    }

    [WebMethod(EnableSession = true)]
    [ScriptMethod(ResponseFormat = ResponseFormat.Json)]

    public string getRegion(int CityID)
    {

        MvcXmlEntities ConnXml = new MvcXmlEntities();
        string str = "";
        foreach (Region item in ConnXml.Region.Where(x => x.CityID == CityID).OrderBy(x => x.RegionName))
        {
            str += "<option value=\"" + item.RegionID + "\">" + item.RegionName + "</option>";
        }
        return str;
    }

    [WebMethod(EnableSession = false)]
    [ScriptMethod(ResponseFormat = ResponseFormat.Json, UseHttpGet = false)]
    public string VerifyToken(string token)
    {
        string tClient = token;
        string secret = "0x4AAAAAAASO4f4EsfD7ICa-vp0J_rc9LnA";

        var dictionary = new Dictionary<string, string>
         {
             { "secret", secret },
             { "response", tClient },
             { "remoteip", "" },
             { "idempotency_key", "" },
         };

        // Veriyi JSON formatına dönüştürme
        var jsonContent = JsonConvert.SerializeObject(dictionary);

        // İstek yapılacak URL
        var url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

        var request = (System.Net.HttpWebRequest)System.Net.WebRequest.Create(url);
        request.Method = "POST";
        request.ContentType = "application/json";

        // Veriyi isteğe yazma
        using (var streamWriter = new StreamWriter(request.GetRequestStream()))
        {
            streamWriter.Write(jsonContent);
            streamWriter.Flush();
            streamWriter.Close();
        }


        var response = (System.Net.HttpWebResponse)request.GetResponse();


        using (var streamReader = new StreamReader(response.GetResponseStream()))
        {
            var result = streamReader.ReadToEnd();
            if (result.Contains("true"))
            {
                return "true";
            }
            return result;
        }
        return string.Empty;
    }

    [WebMethod(EnableSession = false)]
    [ScriptMethod(ResponseFormat = ResponseFormat.Json, UseHttpGet = true)]

    public string GetDailyBullettin(int page)
    {
        var skip = (page - 1) * 6;
        int getLang = Shared.GetLang();
        System.Globalization.CultureInfo cultureinfo =
        new System.Globalization.CultureInfo(getLang.toLangCulture());
        List<BIST100Bulletin> dailyReportx = null;
        using (MvcXmlEntities ConnXml = new MvcXmlEntities())
        {
            dailyReportx = ConnXml.BIST100Bulletin.Where(x => x.Status)
                          .OrderByDescending(x => x.Date).Skip(skip).Take(6).ToList();
        }
        List<BIST100BulletinDto> dtos = new List<BIST100BulletinDto>();
        foreach (var item in dailyReportx)
        {
            var elem = new BIST100BulletinDto
            {
                Day = item.Date.Day.ToString(),
                Date = item.Date.ToString("MMMM yyyy", cultureinfo),
                ImageUrl = item.ImageUrl,
                Title = item.Title,
                ButtonTxt = Shared.GetTranslation(46),
                Folder = "BIST100Bulletin"
            };
            dtos.Add(elem);
        }
        var result = JsonConvert.SerializeObject(dtos);
        return result;
    }

    [WebMethod(EnableSession = false)]
    [ScriptMethod(ResponseFormat = ResponseFormat.Json, UseHttpGet = true)]

    public string GetCompanyReport(int page)
    {
        var skip = (page - 1) * 6;
        int getLang = Shared.GetLang();
        System.Globalization.CultureInfo cultureinfo =
        new System.Globalization.CultureInfo(getLang.toLangCulture());
        List<CompanyReport> dailyReportx = null;
        using (MvcXmlEntities ConnXml = new MvcXmlEntities())
        {
            dailyReportx = ConnXml.CompanyReport.Where(x => x.Status)
                          .OrderByDescending(x => x.Date).Skip(skip).Take(6).ToList();
        }

        List<CompanyReportDto> dtos = new List<CompanyReportDto>();
        foreach (var item in dailyReportx)
        {
            var elem = new CompanyReportDto
            {
                Day = item.Date.Day.ToString(),
                Date = item.Date.ToString("MMMM yyyy", cultureinfo),
                ImageUrl = item.ImageUrl,
                Title = item.Title,
                ButtonTxt = Shared.GetTranslation(46),
                Folder = "CompanyReport"
            };
            dtos.Add(elem);
        }
        var result = JsonConvert.SerializeObject(dtos);
        return result;
    }

    [WebMethod(EnableSession = false)]
    [ScriptMethod(ResponseFormat = ResponseFormat.Json, UseHttpGet = true)]

    public string GetLocalTechnicalAnalysis(int page)
    {
        var skip = (page - 1) * 6;
        int getLang = Shared.GetLang();
        System.Globalization.CultureInfo cultureinfo =
        new System.Globalization.CultureInfo(getLang.toLangCulture());
        List<LocalTechnicalAnalysis> dailyReportx = null;
        using (MvcXmlEntities ConnXml = new MvcXmlEntities())
        {
            dailyReportx = ConnXml.LocalTechnicalAnalysis.Where(x => x.Status)
                          .OrderByDescending(x => x.Date).Skip(skip).Take(6).ToList();
        }

        List<LocalTechnicalAnalysisDto> dtos = new List<LocalTechnicalAnalysisDto>();
        foreach (var item in dailyReportx)
        {
            var elem = new LocalTechnicalAnalysisDto
            {
                Day = item.Date.Day.ToString(),
                Date = item.Date.ToString("MMMM yyyy", cultureinfo),
                ImageUrl = item.ImageUrl,
                Title = item.Title,
                ButtonTxt = Shared.GetTranslation(46),
                Folder = "LocalTechnicalAnalysis"
            };
            dtos.Add(elem);
        }
        var result = JsonConvert.SerializeObject(dtos);
        return result;
    }

    [WebMethod(EnableSession = false)]
    [ScriptMethod(ResponseFormat = ResponseFormat.Json, UseHttpGet = true)]
    public string GetOtherReport(int page)
    {
        var skip = (page - 1) * 6;
        int getLang = Shared.GetLang();
        System.Globalization.CultureInfo cultureinfo =
        new System.Globalization.CultureInfo(getLang.toLangCulture());
        List<OtherReports> dailyReportx = null;
        using (MvcXmlEntities ConnXml = new MvcXmlEntities())
        {
            dailyReportx = ConnXml.OtherReports.Where(x => x.Status.Value)
                          .OrderByDescending(x => x.Date).Skip(skip).Take(6).ToList();
        }

        List<OtherReportsDto> dtos = new List<OtherReportsDto>();
        foreach (var item in dailyReportx)
        {
            var elem = new OtherReportsDto
            {
                Day = item.Date.Value.Day.ToString(),
                Date = item.Date.Value.ToString("MMMM yyyy", cultureinfo),
                ImageUrl = item.ImageUrl,
                Title = item.Title,
                ButtonTxt = Shared.GetTranslation(46),
                Folder = "OtherReports"
            };
            dtos.Add(elem);
        }
        var result = JsonConvert.SerializeObject(dtos);
        return result;
    }


    [WebMethod(EnableSession = false)]
    [ScriptMethod(ResponseFormat = ResponseFormat.Json, UseHttpGet = true)]
    public string GetAbdBullettin(int page)
    {
        var skip = (page - 1) * 6;
        int getLang = Shared.GetLang();
        System.Globalization.CultureInfo cultureinfo =
        new System.Globalization.CultureInfo(getLang.toLangCulture());
        List<ABDBulletin> dailyReportx = null;
        using (MvcXmlEntities ConnXml = new MvcXmlEntities())
        {
            dailyReportx = ConnXml.ABDBulletin.Where(x => x.Status)
                          .OrderByDescending(x => x.Date).Skip(skip).Take(6).ToList();
        }

        List<ABDBullettinDto> dtos = new List<ABDBullettinDto>();
        foreach (var item in dailyReportx)
        {
            var elem = new ABDBullettinDto
            {
                Day = item.Date.Day.ToString(),
                Date = item.Date.ToString("MMMM yyyy", cultureinfo),
                ImageUrl = item.ImageUrl,
                Title = item.Title,
                ButtonTxt = Shared.GetTranslation(46),
                Folder = "ABDBulletin"
            };
            dtos.Add(elem);
        }
        var result = JsonConvert.SerializeObject(dtos);
        return result;
    }

    [WebMethod(EnableSession = false)]
    [ScriptMethod(ResponseFormat = ResponseFormat.Json, UseHttpGet = true)]
    public string GetAbdStockAnalysis(int page)
    {
        var skip = (page - 1) * 6;
        int getLang = Shared.GetLang();
        System.Globalization.CultureInfo cultureinfo =
        new System.Globalization.CultureInfo(getLang.toLangCulture());
        List<ABDStockAnalysis> dailyReportx = null;
        using (MvcXmlEntities ConnXml = new MvcXmlEntities())
        {
            dailyReportx = ConnXml.ABDStockAnalysis.Where(x => x.Status)
                          .OrderByDescending(x => x.Date).Skip(skip).Take(6).ToList();
        }

        List<ABDStockAnalysisDto> dtos = new List<ABDStockAnalysisDto>();
        foreach (var item in dailyReportx)
        {
            var elem = new ABDStockAnalysisDto
            {
                Day = item.Date.Day.ToString(),
                Date = item.Date.ToString("MMMM yyyy", cultureinfo),
                ImageUrl = item.ImageUrl,
                Title = item.Title,
                ButtonTxt = Shared.GetTranslation(46),
                Folder = "ABDStockAnalysis"
            };
            dtos.Add(elem);
        }
        var result = JsonConvert.SerializeObject(dtos);
        return result;
    }

    [WebMethod(EnableSession = false)]
    [ScriptMethod(ResponseFormat = ResponseFormat.Json, UseHttpGet = true)]

    public string RegisterNovemberEvent(string name, string surname, string email, string phone, string company, string position)
    {
        try
        {
            using (MvcXmlEntities ConnXml = new MvcXmlEntities())
            {
                var d = ConnXml.NovemberEventMember.Add(new NovemberEventMember
                {
                    Company = company,
                    Email = email,
                    Name = name,
                    Phone = phone,
                    Position = position,
                    Surname = surname,
                    Id = Guid.NewGuid(),
                    CreatedDate = DateTime.Now,
                });
                ConnXml.SaveChanges();
            }
            if (!string.IsNullOrEmpty(email))
            {
                var body = "<!DOCTYPE html>\r\n<html>\r\n<head>\r\n<title>PhillipCapital Event</title>\r\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\r\n</head>\r\n<body bgcolor=\"#FFFFFF\" leftmargin=\"0\" topmargin=\"0\" marginwidth=\"0\" marginheight=\"0\">\r\n<!-- Save for Web Slices (Mailing-1-tr(garipalternatiftalebi)2.jpg) -->\r\n<table id=\"Table_01\" width=\"600\" height=\"1034\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\">\r\n\t<tr>\r\n\t\t<td>\r\n\t\t\t<a href=\"https://phillipcapital.com.tr/\"><img src=\"https://www.phillipcapital.com.tr/Content/images/event-november/images/kayit-tamamlandi_01.jpg\" width=\"300\" height=\"103\" alt=\"\"></a></td>\r\n\t\t<td colspan=\"2\">\r\n\t\t\t<img src=\"https://www.phillipcapital.com.tr/Content/images/event-november/images/kayit-tamamlandi_02.jpg\" width=\"162\" height=\"103\" alt=\"\"></td>\r\n\t\t<td>\r\n\t\t\t<a href=\"https://www.youtube.com/c/PhillipCapitalT%C3%BCrkiye\"><img src=\"https://www.phillipcapital.com.tr/Content/images/event-november/images/kayit-tamamlandi_03.jpg\" width=\"29\" height=\"103\" alt=\"\"></a></td>\r\n\t\t<td>\r\n\t\t\t<img src=\"https://www.phillipcapital.com.tr/Content/images/event-november/images/kayit-tamamlandi_04.jpg\" width=\"10\" height=\"103\" alt=\"\"></td>\r\n\t\t<td>\r\n\t\t\t<a href=\"https://twitter.com/phillip_capital\"><img src=\"https://www.phillipcapital.com.tr/Content/images/event-november/images/kayit-tamamlandi_05.jpg\" width=\"33\" height=\"103\" alt=\"\"></a></td>\r\n\t\t<td>\r\n\t\t\t<img src=\"https://www.phillipcapital.com.tr/Content/images/event-november/images/kayit-tamamlandi_06.jpg\" width=\"9\" height=\"103\" alt=\"\"></td>\r\n\t\t<td>\r\n\t\t\t<a href=\"https://instagram.com/phillipcapitalturkiye\"><img src=\"https://www.phillipcapital.com.tr/Content/images/event-november/images/kayit-tamamlandi_07.jpg\" width=\"25\" height=\"103\" alt=\"\"></a></td>\r\n\t\t<td>\r\n\t\t\t<img src=\"https://www.phillipcapital.com.tr/Content/images/event-november/images/kayit-tamamlandi_08.jpg\" width=\"32\" height=\"103\" alt=\"\"></td>\r\n\t</tr>\r\n\t<tr>\r\n\t\t<td colspan=\"9\">\r\n\t\t\t<img src=\"https://www.phillipcapital.com.tr/Content/images/event-november/images/kayit-tamamlandi_09.jpg\" width=\"600\" height=\"693\" alt=\"\"></td>\r\n\t</tr>\r\n\t<tr>\r\n\t\t<td colspan=\"2\">\r\n\t\t\t<a href=\"https://maps.app.goo.gl/jEfaoB2GrULArdm46\"><img src=\"https://www.phillipcapital.com.tr/Content/images/event-november/images/kayit-tamamlandi_10.jpg\" width=\"369\" height=\"134\" alt=\"\"></a></td>\r\n\t\t<td colspan=\"7\" rowspan=\"2\">\r\n\t\t\t<img src=\"https://www.phillipcapital.com.tr/Content/images/event-november/images/kayit-tamamlandi_11.jpg\" width=\"231\" height=\"237\" alt=\"\"></td>\r\n\t</tr>\r\n\t<tr>\r\n\t\t<td colspan=\"2\">\r\n\t\t\t<img src=\"https://www.phillipcapital.com.tr/Content/images/event-november/images/kayit-tamamlandi_12.jpg\" width=\"369\" height=\"103\" alt=\"\"></td>\r\n\t</tr>\r\n\t<tr>\r\n\t\t<td>\r\n\t\t\t<img src=\"https://www.phillipcapital.com.tr/Content/images/event-november/images/spacer.gif\" width=\"300\" height=\"1\" alt=\"\"></td>\r\n\t\t<td>\r\n\t\t\t<img src=\"https://www.phillipcapital.com.tr/Content/images/event-november/images/spacer.gif\" width=\"69\" height=\"1\" alt=\"\"></td>\r\n\t\t<td>\r\n\t\t\t<img src=\"https://www.phillipcapital.com.tr/Content/images/event-november/images/spacer.gif\" width=\"93\" height=\"1\" alt=\"\"></td>\r\n\t\t<td>\r\n\t\t\t<img src=\"https://www.phillipcapital.com.tr/Content/images/event-november/images/spacer.gif\" width=\"29\" height=\"1\" alt=\"\"></td>\r\n\t\t<td>\r\n\t\t\t<img src=\"https://www.phillipcapital.com.tr/Content/images/event-november/images/spacer.gif\" width=\"10\" height=\"1\" alt=\"\"></td>\r\n\t\t<td>\r\n\t\t\t<img src=\"https://www.phillipcapital.com.tr/Content/images/event-november/images/spacer.gif\" width=\"33\" height=\"1\" alt=\"\"></td>\r\n\t\t<td>\r\n\t\t\t<img src=\"https://www.phillipcapital.com.tr/Content/images/event-november/images/spacer.gif\" width=\"9\" height=\"1\" alt=\"\"></td>\r\n\t\t<td>\r\n\t\t\t<img src=\"https://www.phillipcapital.com.tr/Content/images/event-november/images/spacer.gif\" width=\"25\" height=\"1\" alt=\"\"></td>\r\n\t\t<td>\r\n\t\t\t<img src=\"https://www.phillipcapital.com.tr/Content/images/event-november/images/spacer.gif\" width=\"32\" height=\"1\" alt=\"\"></td>\r\n\t</tr>\r\n</table>\r\n<!-- End Save for Web Slices -->\r\n</body>\r\n</html>";

                SendEmail("PhillipCapital 7 Kasım Etkinliği", body, email);
            } 
            return JsonConvert.SerializeObject(new { isSuccess =true, message = "Kayıt Oluşturuldu"});
        }
        catch (Exception ex)
        {
            return JsonConvert.SerializeObject(new { isSuccess = true, message = ex.Message });
        }

    }
    public static void SendEmail(string Baslik, string Govde, string Email)
    { 
        try
        {
            string ToAddress = "";
            string CCAddress = "";
            string EmailFrom = "bilgi@phillipcapital.org";
            string EmailFromPass = "!!Phc44**";
            string Smtp = "mail.phillipcapital.org";
            int Port = 25;
            string NameFrom = "PhillipCapital Menkul Degerler A.S."; 
 
           
            // Mail Gönderim
            MailMessage mail = new MailMessage();
            mail.From = new MailAddress(EmailFrom, NameFrom); 
            mail.To.Add(Email); 
            mail.Subject = Baslik;
            mail.Body = Govde;
            mail.IsBodyHtml = true;
            SmtpClient SmtpServer = new SmtpClient(Smtp);
            SmtpServer.Port = Port;
            SmtpServer.Credentials = new System.Net.NetworkCredential(EmailFrom, EmailFromPass);
            //SmtpServer.EnableSsl = true;
            SmtpServer.Send(mail); 
            mail.To.Clear();
        }
        catch (Exception w)
        {
            Console.WriteLine(w.Message); 
        }
    }
    public class VerifyTokenRequest
    {
        public string Token { get; set; }
        public string SecretKey { get; set; }
        public string IP { get; set; }
    }

    public class BaseDto
    {
        public string Day { get; set; }
        public string Date { get; set; }

        public string Title { get; set; }

        public string ImageUrl { get; set; }
        public string ButtonTxt { get; set; }

        public string Folder { get; set; }
    }

    public class BIST100BulletinDto : BaseDto
    {

    }

    public class CompanyReportDto : BaseDto
    {

    }

    public class LocalTechnicalAnalysisDto : BaseDto
    {
    }

    public class OtherReportsDto : BaseDto
    {
    }

    public class ABDBullettinDto : BaseDto
    {
    }

    public class ABDStockAnalysisDto : BaseDto
    {
    }
}