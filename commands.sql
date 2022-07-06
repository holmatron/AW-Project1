CREATE DATABASE grouponeeka;
CREATE TABLE timestamps (
    id SERIAL PRIMARY KEY,
    start_date VARCHAR(255) NOT NULL,
    start_time TIME NOT NULL,
    end_date VARCHAR(255) NOT NULL,
    end_time TIME NOT NULL,
    project VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    time_sum VARCHAR(255)
);