set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_user_details()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$DECLARE
    full_name text;
BEGIN
    INSERT INTO public.users (id, email_address, created_at)
    VALUES (
        NEW.id,
        NEW.email,
        now()
    );
    RETURN NEW;
END;$function$
;


