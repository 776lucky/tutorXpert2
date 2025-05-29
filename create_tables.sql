CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255),
    hashed_password VARCHAR(255),
    role VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS profile (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone_number VARCHAR(20),
    address TEXT,
    education_level VARCHAR(50),
    major TEXT,
    certifications TEXT,
    working_with_children_check VARCHAR(50),
    subjects TEXT,
    has_experience BOOLEAN,
    experience_details TEXT,
    availability TEXT,
    accepts_short_notice BOOLEAN
);