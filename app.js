

CREATE TABLE timestamps (
    id SERIAL PRIMARY KEY,
    start_date TIMESTAMP NOT NULL,
    start_time TIME NOT NULL,
    end_date TIMESTAMP NOT NULL,
    end_time TIME NOT NULL,
    project VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL
);