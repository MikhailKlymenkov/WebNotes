namespace API.Model;

public class Note
{
    public int Id { get; set; }

    public string UserId { get; set; } = null!;

    public User User { get; set; } = null!;

    public string Title { get; set; } = null!;

    public string Body { get; set; } = null!;

    public DateTime CreationDate { get; set; }

    public bool IsEdited { get; set; }
}