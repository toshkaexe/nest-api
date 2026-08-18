CREATE TABLE IF NOT EXISTS refresh_token_meta (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    ip VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    issued_at TIMESTAMP NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    last_active_date TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS ip_restrictions (
    id SERIAL PRIMARY KEY,
    ip VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    date TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT idx_ip_url_date UNIQUE (ip, url, date)
);

CREATE INDEX IF NOT EXISTS idx_refresh_token_device_id ON refresh_token_meta(device_id);
CREATE INDEX IF NOT EXISTS idx_refresh_token_user_id ON refresh_token_meta(user_id);
CREATE INDEX IF NOT EXISTS idx_ip_restrictions_ip_url ON ip_restrictions(ip, url);
CREATE INDEX IF NOT EXISTS idx_ip_restrictions_date ON ip_restrictions(date);
