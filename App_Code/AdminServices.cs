using Newtonsoft.Json;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web.Script.Services;
using System.Web.Services;

/// <summary>
/// Summary description for AdminServices
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
[ScriptService]
public class AdminServices : WebService
{

    public AdminServices()
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

    [WebMethod(EnableSession = true)]
    [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
    public string getRegionx()
    { 
        return "";
    }

    

   
}