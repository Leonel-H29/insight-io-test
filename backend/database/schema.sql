CREATE TABLE tasks (
  id CHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  status ENUM('PENDING','IN_PROGRESS','DONE','ARCHIVED') NOT NULL DEFAULT 'PENDING',
  owner_id VARCHAR(255) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  INDEX idx_tasks_owner_status (owner_id, status),
  INDEX idx_tasks_owner_updated (owner_id, updated_at)
);
