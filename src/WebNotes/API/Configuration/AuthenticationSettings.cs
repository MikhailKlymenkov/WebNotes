namespace API.Configuration;

public class AuthenticationSettings
{
    public string Key { get; set; }

    public string Issuer { get; set; }

    public TimeSpan ExpiryPeriod { get; set; }
}
