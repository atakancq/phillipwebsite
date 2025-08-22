using System;
using System.Linq;
using System.Web;
//
public class Login
{
    //
    public bool IsLogin()
    {
        return HttpContext.Current.Session["AdminLoginID"] != null;
    }
    //
    public void LogoutUser()
    {
        HttpContext.Current.Session["AdminLoginID"] = null;
    }
    //
    public int LoginUserID()
    {
        return Convert.ToInt32(HttpContext.Current.Session["AdminLoginID"].ToString());
    }
    //
    public bool SignInUser(string UserNameOrEmail, string PassWord)
    {
        bool LoginComplete = false;

        MvcXmlEntities ConnXml = new MvcXmlEntities();
        string strMd5Password = PassWord.md5();

        if (ConnXml.Admin.Any(x => (x.Email == UserNameOrEmail.Trim() || x.UserName == UserNameOrEmail.Trim()) && x.PassWord == strMd5Password))
        {
            Admin getAdmin = ConnXml.Admin.FirstOrDefault(x => (x.Email == UserNameOrEmail.Trim() || x.UserName == UserNameOrEmail.Trim()) && x.PassWord == strMd5Password);
            HttpContext.Current.Session.Add("AdminLoginID", getAdmin.AdminID);
            LoginComplete = true;
        }

        return LoginComplete;
    }
    //
    public bool Authorization(string Url) {
        return true;
    }
}