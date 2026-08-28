namespace ReactWithASP.Server.Models.Main
{
    public class TaskItem
    {
        public int Id { get; set; }
        public string TaskId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Status { get; set; } = "todo";
        public string Label { get; set; } = "feature";
        public string Priority { get; set; } = "medium";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
