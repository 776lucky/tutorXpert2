UPDATE tasks
SET posted_date = DATETIME('now')
WHERE id = 4;
select * from tasks;