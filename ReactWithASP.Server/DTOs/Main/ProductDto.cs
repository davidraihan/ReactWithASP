namespace ReactWithASP.Server.DTOs.Main
{
    public class ProductCreateRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Sku { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Image { get; set; } = string.Empty;
    }

    public class ProductUpdateRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Sku { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public string Status { get; set; } = "in_stock";
        public string Description { get; set; } = string.Empty;
        public string Image { get; set; } = string.Empty;
    }
}
