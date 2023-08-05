using System.Security.Cryptography;
using System.Text;

namespace API.Services;

public class CryptographyService : ICryptographyService
{
    public string GetSha256Hash(string key)
    {
        byte[] passwordBytes = Encoding.UTF8.GetBytes(key);
        using var sha256 = SHA256.Create();
        byte[] hashedPasswordBytes = sha256.ComputeHash(passwordBytes);
        return Convert.ToBase64String(hashedPasswordBytes);
    }
}
