DROP TRIGGER fix_timestamp ON sharedpositions;

CREATE OR REPLACE FUNCTION fix_now_timestamp() RETURNS TRIGGER AS $fix_timestamp$
    BEGIN
        --IF (NEW.datetime_changed IS NULL) THEN
            NEW.datetime_changed = now();
        --END IF;
        RETURN NEW;
    END;
$fix_timestamp$ LANGUAGE plpgsql;

CREATE TRIGGER fix_timestamp
BEFORE INSERT OR UPDATE ON sharedpositions
    FOR EACH ROW EXECUTE PROCEDURE fix_now_timestamp();