# External API Request Examples

## Example 1: MySQL Database Analysis

**Request to External API:**
```json
{
  "type": "database",
  "connectionString": "mysql://root:password123@localhost:3306/sales_db",
  "dbType": "mysql"
}
```

**What your external API should do:**
1. Parse the connection string
2. Connect to the MySQL database
3. Query the data
4. Perform analysis
5. Return the response

---

## Example 2: PostgreSQL Database Analysis

**Request to External API:**
```json
{
  "type": "database",
  "connectionString": "postgresql://admin:securepass@db.example.com:5432/analytics_db",
  "dbType": "postgresql"
}
```

---

## Example 3: MongoDB Database Analysis

**Request to External API:**
```json
{
  "type": "database",
  "connectionString": "mongodb://user:pass@localhost:27017/customer_data",
  "dbType": "mongodb"
}
```

---

## Example 4: CSV File Analysis

**Request to External API:**
```json
{
  "type": "file",
  "fileUri": "C:\\Users\\jaste\\Projects\\HackCBS 2.0\\backend\\public\\uploads\\sales-1699520345678.csv",
  "fileName": "sales_report.csv",
  "fileType": "csv"
}
```

**What your external API should do:**
1. Read the file from the provided URI/path
2. Parse the CSV data
3. Perform analysis
4. Return the response

---

## Example 5: Excel File Analysis

**Request to External API:**
```json
{
  "type": "file",
  "fileUri": "C:\\Users\\jaste\\Projects\\HackCBS 2.0\\backend\\public\\uploads\\inventory-1699520567890.xlsx",
  "fileName": "inventory_data.xlsx",
  "fileType": "xlsx"
}
```

---

## Expected Response Format (Same for all types)

```json
{
  "summary": "This dataset contains sales data from Q1 2024 with 1,234 transactions across 5 product categories. Total revenue shows an upward trend with peak sales in March.",
  "keyInsights": [
    "Revenue increased by 23% compared to previous quarter",
    "Product Category 'Electronics' accounts for 45% of total sales",
    "Customer retention rate improved to 78%",
    "Average order value: $156.78",
    "Top performing region: North America (62% of sales)"
  ],
  "visualizations": [
    {
      "chartType": "line",
      "title": "Monthly Revenue Trend",
      "description": "Revenue performance over the quarter",
      "data": [
        { "name": "January", "value": 45000 },
        { "name": "February", "value": 52000 },
        { "name": "March", "value": 68000 }
      ],
      "config": {
        "xKey": "name",
        "yKey": "value",
        "color": "#2563eb"
      }
    },
    {
      "chartType": "pie",
      "title": "Sales by Category",
      "description": "Distribution of sales across product categories",
      "data": [
        { "name": "Electronics", "value": 45 },
        { "name": "Clothing", "value": 25 },
        { "name": "Home & Garden", "value": 15 },
        { "name": "Sports", "value": 10 },
        { "name": "Books", "value": 5 }
      ],
      "config": {
        "nameKey": "name",
        "dataKey": "value"
      }
    },
    {
      "chartType": "bar",
      "title": "Top 5 Products",
      "description": "Best selling products by quantity",
      "data": [
        { "name": "Laptop Pro", "value": 234 },
        { "name": "Smartphone X", "value": 189 },
        { "name": "Wireless Earbuds", "value": 156 },
        { "name": "Tablet Mini", "value": 134 },
        { "name": "Smart Watch", "value": 98 }
      ],
      "config": {
        "xKey": "name",
        "yKey": "value",
        "color": "#10b981"
      }
    }
  ]
}
```

---

## Important Notes

1. **File Paths:** The `fileUri` will be an absolute path on the server where the backend is running. Your external API must have access to this path.

2. **Connection Strings:** Include all necessary credentials. Ensure your external API handles these securely.

3. **Chart Types:** Currently supported: `bar`, `line`, `pie`, `scatter`, `area`

4. **Data Format:** The `data` array format should match the chart type requirements for Recharts library.

5. **Timeout:** Your API has 60 seconds to respond for analysis requests.
