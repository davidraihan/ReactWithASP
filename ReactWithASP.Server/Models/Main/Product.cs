namespace ReactWithASP.Server.Models.Main
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Sku { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public string Status { get; set; } = "in_stock";
        public string Description { get; set; } = string.Empty;
        public string Image { get; set; } = string.Empty;
        public int SalesCount { get; set; }
    }
}
