using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactWithASP.Server.Data;
using ReactWithASP.Server.DTOs.Main;
using ReactWithASP.Server.Models.Main;

namespace ReactWithASP.Server.Controllers.Main
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TasksController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/tasks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskItem>>> GetTasks()
        {
            return await _context.Tasks.OrderByDescending(t => t.CreatedAt).ToListAsync();
        }

        // GET: api/tasks/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TaskItem>> GetTask(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return NotFound();
            return task;
        }

        // POST: api/tasks
        [HttpPost]
        public async Task<ActionResult<TaskItem>> CreateTask(TaskCreateRequest request)
        {
            var randomNum = new Random().Next(1000, 9999);
            var task = new TaskItem
            {
                TaskId = $"TASK-{randomNum}",
                Title = request.Title,
                Status = string.IsNullOrWhiteSpace(request.Status) ? "todo" : request.Status,
                Label = string.IsNullOrWhiteSpace(request.Label) ? "feature" : request.Label,
                Priority = string.IsNullOrWhiteSpace(request.Priority) ? "medium" : request.Priority,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
        }

        // PUT: api/tasks/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, TaskUpdateRequest request)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return NotFound();

            task.Title = request.Title;
            task.Status = request.Status;
            task.Label = request.Label;
            task.Priority = request.Priority;
            task.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(task);
        }

        // DELETE: api/tasks/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return NotFound();

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // POST: api/tasks/bulk-delete
        [HttpPost("bulk-delete")]
        public async Task<IActionResult> BulkDeleteTasks([FromBody] TaskBulkDeleteRequest request)
        {
            if (request?.Ids == null || request.Ids.Count == 0)
                return BadRequest("No IDs provided.");

            var items = await _context.Tasks.Where(t => request.Ids.Contains(t.Id)).ToListAsync();
            _context.Tasks.RemoveRange(items);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
