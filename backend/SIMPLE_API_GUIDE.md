# What Gets Sent to External API

## Simple Summary

The backend sends **ONLY** the connection string (for databases) or file URI (for files). Nothing else.

---

## Database Example

### User Input:
```
Connection Name: My Production DB
Database Type: MySQL
Host: localhost
Port: 3306
Username: root
Password: mypassword
Database Name: sales_db
```

### What Backend Sends to External API:
```json
{
  "type": "database",
  "connectionString": "mysql://root:mypassword@localhost:3306/sales_db",
  "dbType": "mysql"
}
```

**That's it!** No data extraction, no metadata, no sample data.

---

## File Upload Example

### User Action:
Uploads file: `quarterly_sales.csv`

### What Backend Sends to External API:
```json
{
  "type": "file",
  "fileUri": "C:\\Users\\jaste\\Projects\\HackCBS 2.0\\backend\\public\\uploads\\quarterly_sales-1699520345678.csv",
  "fileName": "quarterly_sales.csv",
  "fileType": "csv"
}
```

**That's it!** The file is saved on the server and only the path is sent.

---

## Your External API's Responsibility

### For Database Requests:
1. Receive the connection string
2. Parse it to get credentials
3. Connect to the database
4. Query and extract data
5. Perform analysis
6. Return results

### For File Requests:
1. Receive the file URI
2. Read the file from that path
3. Parse the CSV/XLSX
4. Perform analysis
5. Return results

---

## Backend Does NOT Send:
- ❌ Extracted data
- ❌ Sample data
- ❌ Column names
- ❌ Row counts
- ❌ Metadata

## Backend DOES Send:
- ✅ Connection string (for DB)
- ✅ File URI/path (for files)
- ✅ Type and basic info

---

## Expected Response (Same as Before)

Your external API must return:

```json
{
  "summary": "Analysis summary text...",
  "keyInsights": [
    "Insight 1",
    "Insight 2",
    "Insight 3"
  ],
  "visualizations": [
    {
      "chartType": "bar",
      "title": "Chart Title",
      "description": "Description",
      "data": [...],
      "config": {...}
    }
  ]
}
```
