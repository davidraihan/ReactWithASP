using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace ReactWithASP.Server.Filters
{
    /// <summary>
    /// Operation filter to handle IFormFile parameters in Swagger documentation
    /// </summary>
    public class FormFileOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            var formFileParams = context.MethodInfo.GetParameters()
                .Where(p => p.GetCustomAttributes(typeof(Microsoft.AspNetCore.Mvc.FromFormAttribute), false)
                    .Any())
                .ToList();

            if (!formFileParams.Any())
                return;

            operation.RequestBody = new OpenApiRequestBody()
            {
                Content = new Dictionary<string, OpenApiMediaType>
                {
                    ["multipart/form-data"] = new OpenApiMediaType
                    {
                        Schema = new OpenApiSchema
                        {
                            Type = JsonSchemaType.Object,
                            Properties = new Dictionary<string, IOpenApiSchema>
                            {
                                ["file"] = new OpenApiSchema
                                {
                                    Type = JsonSchemaType.String,
                                    Format = "binary",
                                    Description = "Image file (jpg, jpeg, png, gif, webp)"
                                }
                            },
                            Required = new HashSet<string> { "file" }
                        }
                    }
                }
            };
        }
    }
}
