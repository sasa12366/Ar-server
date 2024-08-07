-- CREATE "ar_objects" table if it does not exist
DO
$$
    BEGIN
        IF NOT EXISTS
            (SELECT 1
             FROM information_schema.tables
             WHERE table_schema = 'public'
               AND table_name = 'ar_objects'
            )
        THEN
            CREATE TABLE ar_objects
            (
                id             SERIAL PRIMARY KEY,
                name           VARCHAR(255) NOT NULL,
                added_date     DATE NOT NULL,
                ar_marker      TEXT,
                content        TEXT,
                qr_code        TEXT
            );
        END IF;
    END
$$;
-- CREATE "users" table if it does not exist
DO
$$
    BEGIN
        IF NOT EXISTS
            (SELECT 1
             FROM information_schema.tables
             WHERE table_schema = 'public'
               AND table_name = 'users'
            )
        THEN
            CREATE TABLE users
            (
                id         SERIAL PRIMARY KEY,
                username   VARCHAR(255) NOT NULL,
                phone_number TEXT,
                password     VARCHAR(150) NOT NULL
            );
        END IF;
    END
$$;

-- CREATE "tokens"
DO
$$
    BEGIN
        IF NOT EXISTS
            (SELECT 1
             FROM information_schema.tables
             WHERE table_schema = 'public'
               AND table_name = 'tokens'
            )
        THEN
            CREATE TABLE tokens
            (
                id       SERIAL PRIMARY KEY,
                user_id   INTEGER NOT NULL,
                role     VARCHAR(100) NOT NULL,
                token    VARCHAR(300) NOT NULL
            );
        END IF;
    END
$$;


-- FILL "ar_objects" with some data
DO
$$
    BEGIN
        IF NOT EXISTS
            (SELECT 1
             FROM public.ar_objects
             WHERE name = 'Курский гимн'
               AND added_date = '2023-10-01'
            )
        THEN
            INSERT INTO public.ar_objects (name, added_date, ar_marker, content, qr_code)
            VALUES ('Курский гимн', '2023-10-01', NULL, NULL, NULL);
        END IF;
    END
$$;

-- FILL "users" with some data
DO
$$
    BEGIN
        IF NOT EXISTS
            (SELECT 1
             FROM public.users
             WHERE id = 1
            )
        THEN
            INSERT INTO public.users (id, username, phone_number, password)
            VALUES 
            (1, 'Александр', '89513381165', '*'),
            (2, 'Мария', '89513381143', '*'),
            (3, 'Иван', '89513554326', '*'),
            (4, 'Ольга', '89513392276', '*');
        END IF;
    END
$$;