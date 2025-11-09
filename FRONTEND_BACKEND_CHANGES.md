# Updated Frontend & Backend

## Frontend Changes

### New Database Connection Form
Now shows only 2 fields:
1. **Connection Name** (optional)
2. **Connection String** (required)

Example input:
```
mysql://root:password@localhost:3306/mydb
```

### File Upload
Remains the same - user uploads CSV/XLSX file

---

## Backend Changes

### Database Submission Endpoint
**Endpoint:** `POST /api/v1/datasources/database`

**Old Request Body:**
```json
{
  "name": "My DB",
  "dbType": "mysql",
  "host": "localhost",
  "port": 3306,
  "username": "root",
  "password": "pass",
  "databaseName": "mydb"
}
```

**New Request Body:**
```json
{
  "name": "My DB",
  "connectionString": "mysql://root:pass@localhost:3306/mydb"
}
```

### What Gets Sent to External API

**For Database:**
```json
{
  "type": "database",
  "connectionString": "mysql://root:pass@localhost:3306/mydb",
  "dbType": "mysql"
}
```

**For File:**
```json
{
  "type": "file",
  "fileUri": "C:\\path\\to\\file.csv",
  "fileName": "data.csv",
  "fileType": "csv"
}
```

---

## User Experience

### Before:
User had to fill 7 fields:
- Connection Name
- Database Type
- Host
- Port  
- Username
- Password
- Database Name

### After:
User fills 1-2 fields:
- Connection Name (optional)
- Connection String (paste entire string)

**Much simpler!** ✅
