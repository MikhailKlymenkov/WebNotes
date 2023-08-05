using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace API.Services;

public interface ICryptographyService
{
    string GetSha256Hash(string key);
}
