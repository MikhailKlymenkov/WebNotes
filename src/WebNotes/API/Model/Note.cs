namespace API.Model;

public class Note
{
    public int Id { get; set; }

    public User User { get; set; }

    public string Title { get; set; }

    public string Body { get; set; }

    public DateTime CreationDate { get; set; }

    public bool IsEdited { get; set; }
}