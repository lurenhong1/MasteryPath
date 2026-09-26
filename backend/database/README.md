# Database scripts

These scripts manage the local MasteryPath development database:

- `schema.sql` contains the complete current database structure.
- `seed.sql` contains required reference data.
- `reset.sql` deletes the `public` schema and reapplies both files in one
  transaction.

Run the reset from the repository root:

```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" `
  -U postgres `
  -d masteryPath `
  -f backend\database\reset.sql
```

Use the database owner in place of `postgres` if the database is owned by a
dedicated application role.

> **Warning:** `reset.sql` permanently deletes every table and row in the
> database's `public` schema. Use it only for local development or disposable
> test databases.
