namespace ReactWithASP.Server.DTOs.Main
{
    public class TaskCreateRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Status { get; set; } = "todo";
        public string Label { get; set; } = "feature";
        public string Priority { get; set; } = "medium";
    }

    public class TaskUpdateRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Status { get; set; } = "todo";
        public string Label { get; set; } = "feature";
        public string Priority { get; set; } = "medium";
    }

    public class TaskBulkDeleteRequest
    {
        public List<int> Ids { get; set; } = new();
    }
}
