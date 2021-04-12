/* Replace with your SQL commands */
CREATE TABLE item_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
