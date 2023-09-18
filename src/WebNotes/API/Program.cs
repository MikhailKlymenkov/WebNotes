using API;
using API.Services;
using API.Configuration;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

var authenticationSettings = builder.Configuration.GetSection(ConfigurationSections.Authentication).Get<AuthenticationSettings>();
var databaseSettings = builder.Configuration.GetSection(ConfigurationSections.Database).Get<DatabaseSettings>();

// Add services to the container.
builder.Services.AddSingleton<ICryptographyService, CryptographyService>();

builder.Services.AddCors();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = false,
            ValidIssuer = authenticationSettings.Issuer,
            ValidateLifetime = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(authenticationSettings.Key)),
            ValidateIssuerSigningKey = true,
        };
    });
builder.Services.AddAuthorization();
// TODO: Use MS SQL Server.
builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite(databaseSettings.ConnectionString));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    app.UseCors(builder => builder.WithOrigins("http://localhost:4200")
    .AllowAnyMethod()
    .AllowAnyHeader()
    .AllowCredentials());
}

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();