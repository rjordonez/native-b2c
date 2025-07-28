-- Check if Part 2 task exists in daily_checklist_tasks
SELECT * FROM daily_checklist_tasks WHERE id = 2;

-- If Part 2 is missing, insert it
INSERT INTO daily_checklist_tasks (id, task_name)
VALUES (2, 'Part 2 - Cue Card Practice (2 min speech)')
ON CONFLICT (id) DO NOTHING;

-- Verify all three parts are in the table
SELECT * FROM daily_checklist_tasks ORDER BY id;