

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "private";


ALTER SCHEMA "private" OWNER TO "postgres";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pg_trgm" WITH SCHEMA "public";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "private"."refresh_event_details"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY private.event_details;
    RETURN NULL;
END;
$$;


ALTER FUNCTION "private"."refresh_event_details"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."categories" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying(100) NOT NULL,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "color" "text"
);


ALTER TABLE "public"."categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."communities" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying(255) NOT NULL,
    "description" "text",
    "member_count" integer DEFAULT 0,
    "is_public" boolean DEFAULT true,
    "is_featured" boolean DEFAULT false,
    "tags" "text"[],
    "rules" "text"[],
    "contact_email" character varying(255),
    "website" character varying(255),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "image_url" "text",
    "location" "text",
    "category" "text",
    "meeting_frequency" "text",
    "recent_discussions" "jsonb",
    "upcoming_events" "jsonb",
    "long_description" "text",
    "organizer_id" "uuid",
    "contact_phone" "text",
    "next_meeting_date" timestamp with time zone,
    "next_meeting_location" "text",
    "next_meeting_details" "jsonb",
    "category_id" "uuid",
    "community_type_id" "uuid",
    CONSTRAINT "communities_contact_phone_check" CHECK (("contact_phone" ~ '^\+?[0-9\s\-\(\)]{6,20}$'::"text"))
);


ALTER TABLE "public"."communities" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."community_types" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."community_types" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "username" "text",
    "full_name" "text",
    "avatar_url" "text",
    "updated_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "email" "text",
    "country" "text",
    "interests" "text"[],
    "bio" "text",
    "social_links" "jsonb" DEFAULT '{}'::"jsonb",
    "preferences" "jsonb" DEFAULT '{"event_reminders": true, "community_invites": true, "push_notifications": true, "email_notifications": true}'::"jsonb",
    "last_active" timestamp with time zone,
    "country_code" "text" DEFAULT '1'::"text",
    "phone_number" "text",
    "city" "text",
    CONSTRAINT "profiles_email_check" CHECK (("email" ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::"text")),
    CONSTRAINT "valid_country_code" CHECK (("country_code" ~ '^[0-9]{1,3}$'::"text")),
    CONSTRAINT "valid_phone_number" CHECK (("phone_number" ~ '^[0-9]{7,15}$'::"text"))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."community_details" WITH ("security_invoker"='on') AS
 SELECT "c"."id",
    "c"."name",
    "c"."description",
    "c"."long_description",
    "c"."image_url",
    "c"."location",
    "c"."member_count",
    "c"."is_public",
    "c"."is_featured",
    "c"."tags",
    "c"."rules",
    "c"."contact_email",
    "c"."contact_phone",
    "c"."website",
    "c"."meeting_frequency",
    "c"."next_meeting_date",
    "c"."next_meeting_location",
    "c"."next_meeting_details",
    "c"."category_id",
    "cat"."name" AS "category_name",
    "cat"."color" AS "category_color",
    "c"."community_type_id",
    "ct"."name" AS "community_type",
    "ct"."description" AS "community_type_description",
    "c"."organizer_id",
    "p"."username" AS "organizer_username",
    "p"."full_name" AS "organizer_name",
    "c"."created_at",
    "c"."updated_at"
   FROM ((("public"."communities" "c"
     LEFT JOIN "public"."categories" "cat" ON (("c"."category_id" = "cat"."id")))
     LEFT JOIN "public"."community_types" "ct" ON (("c"."community_type_id" = "ct"."id")))
     LEFT JOIN "public"."profiles" "p" ON (("c"."organizer_id" = "p"."id")));


ALTER TABLE "public"."community_details" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_communities_by_classification"("p_category_id" "uuid" DEFAULT NULL::"uuid", "p_community_type_id" "uuid" DEFAULT NULL::"uuid", "p_limit" integer DEFAULT 20, "p_offset" integer DEFAULT 0) RETURNS SETOF "public"."community_details"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Set search path to avoid injection
  SET search_path = '';
  
  RETURN QUERY
  SELECT *
  FROM public.community_details
  WHERE 
    (p_category_id IS NULL OR category_id = p_category_id) AND
    (p_community_type_id IS NULL OR community_type_id = p_community_type_id)
  ORDER BY is_featured DESC, member_count DESC, created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;


ALTER FUNCTION "public"."get_communities_by_classification"("p_category_id" "uuid", "p_community_type_id" "uuid", "p_limit" integer, "p_offset" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_event_by_id"("event_id_param" "uuid") RETURNS TABLE("id" "uuid", "name" "text", "description" "text", "date" "date", "time" time without time zone, "location_id" "uuid", "location_name" "text", "category_id" "uuid", "category_name" "text", "event_type_id" "uuid", "event_type_name" "text", "is_free" boolean, "price" numeric, "image_url" "text", "capacity" integer, "organizer" "text", "contact" "text", "website" "text", "requirements" "text", "highlights" "text", "long_description" "text", "is_featured" boolean, "rating" numeric, "attendees_count" bigint, "created_at" timestamp with time zone, "updated_at" timestamp with time zone)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    event_record RECORD;
BEGIN
    SELECT 
        e.id,
        e.name,
        e.description,
        e.date,
        e."time",
        l.id AS location_id,
        l.name AS location_name,
        c.id AS category_id,
        c.name AS category_name,
        et.id AS event_type_id,
        et.name AS event_type_name,
        e.is_free,
        e.price,
        e.image_url,
        e.capacity,
        e.organizer,
        e.contact,
        e.website,
        e.requirements,
        e.highlights,
        e.long_description,
        e.is_featured,
        e.rating,
        (SELECT COUNT(*) FROM user_event_history ueh WHERE ueh.event_id = e.id) AS attendees_count,
        e.created_at,
        e.updated_at
    INTO event_record
    FROM 
        events e
    LEFT JOIN 
        locations l ON e.location_id = l.id
    LEFT JOIN 
        categories c ON e.category_id = c.id
    LEFT JOIN 
        event_types et ON e.event_type_id = et.id
    WHERE 
        e.id = event_id_param;

    RETURN QUERY 
    SELECT 
        event_record.id,
        event_record.name,
        event_record.description,
        event_record.date,
        event_record."time",
        event_record.location_id,
        event_record.location_name,
        event_record.category_id,
        event_record.category_name,
        event_record.event_type_id,
        event_record.event_type_name,
        event_record.is_free,
        event_record.price,
        event_record.image_url,
        event_record.capacity,
        event_record.organizer,
        event_record.contact,
        event_record.website,
        event_record.requirements,
        event_record.highlights,
        event_record.long_description,
        event_record.is_featured,
        event_record.rating,
        event_record.attendees_count,
        event_record.created_at,
        event_record.updated_at;
END;
$$;


ALTER FUNCTION "public"."get_event_by_id"("event_id_param" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_events_with_details_v2"() RETURNS TABLE("event_id" "uuid", "event_name" "text", "event_description" "text", "date" timestamp with time zone, "is_free" boolean, "event_image" "text", "event_image_url" "text", "is_featured" boolean, "rating" numeric, "category_id" "uuid", "category_name" "text", "category_color" "text", "location_id" "uuid", "location_name" "text", "location_address" "text", "lat" numeric, "lng" numeric, "event_type_id" "uuid", "event_type_name" "text")
    LANGUAGE "sql" SECURITY DEFINER
    AS $$
  SELECT 
    e.id as event_id,
    e.name as event_name,
    e.description as event_description,
    e.date,
    e.is_free,
    e.image as event_image,
    e.image_url as event_image_url,
    e.is_featured,
    e.rating,
    c.id as category_id,
    c.name as category_name,
    c.color as category_color,
    l.id as location_id,
    l.name as location_name,
    l.address as location_address,
    l.lat,
    l.lng,
    et.id as event_type_id,
    et.name as event_type_name
  FROM 
    events e
  LEFT JOIN 
    categories c ON e.category_id = c.id
  LEFT JOIN 
    locations l ON e.location_id = l.id
  LEFT JOIN
    event_types et ON e.event_type_id = et.id
  ORDER BY 
    e.date;
$$;


ALTER FUNCTION "public"."get_events_with_details_v2"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_location_names_and_ids"() RETURNS TABLE("location_id" "uuid", "location_name" "text")
    LANGUAGE "sql"
    AS $$
  SELECT 
    id as location_id,
    name as location_name
  FROM 
    locations
  ORDER BY 
    name;
$$;


ALTER FUNCTION "public"."get_location_names_and_ids"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_communities"("user_uuid" "uuid") RETURNS TABLE("community_id" integer, "community_name" character varying, "community_description" "text", "community_image" character varying, "community_address" character varying, "user_role" character varying, "joined_at" timestamp with time zone)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.name,
        c.description,
        c.image,
        c.address,
        cm.role,
        cm.joined_at
    FROM communities c
    INNER JOIN community_members cm ON c.id = cm.community_id
    WHERE cm.user_id = user_uuid
    ORDER BY cm.joined_at DESC;
END;
$$;


ALTER FUNCTION "public"."get_user_communities"("user_uuid" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_events"("p_user_id" "uuid" DEFAULT NULL::"uuid", "p_status" "text" DEFAULT NULL::"text", "p_from_date" timestamp with time zone DEFAULT NULL::timestamp with time zone, "p_to_date" timestamp with time zone DEFAULT NULL::timestamp with time zone) RETURNS TABLE("event_id" "uuid", "event_name" "text", "event_description" "text", "event_date" timestamp with time zone, "event_location" "text", "event_image_url" "text", "attendance_status" "text", "registered_at" timestamp with time zone)
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Set search path to avoid injection
  SET search_path = '';
  
  -- Use provided user_id or current user
  v_user_id := COALESCE(p_user_id, (select auth.uid()));
  
  RETURN QUERY
  SELECT 
    e.id as event_id,
    e.name as event_name,
    e.description as event_description,
    e.date as event_date,
    e.location_id::text as event_location, -- This assumes location_id is a reference to a locations table
    e.image_url as event_image_url,
    ea.status as attendance_status,
    ea.registered_at
  FROM 
    public.event_attendees ea
  JOIN 
    public.events e ON ea.event_id = e.id
  WHERE 
    ea.user_id = v_user_id
    AND (p_status IS NULL OR ea.status = p_status)
    AND (p_from_date IS NULL OR e.date >= p_from_date)
    AND (p_to_date IS NULL OR e.date <= p_to_date)
  ORDER BY 
    e.date ASC;
END;
$$;


ALTER FUNCTION "public"."get_user_events"("p_user_id" "uuid", "p_status" "text", "p_from_date" timestamp with time zone, "p_to_date" timestamp with time zone) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_favorite_communities"("user_uuid" "uuid") RETURNS TABLE("community_id" "uuid", "community_name" character varying, "community_description" "text", "community_member_count" integer, "favorited_at" timestamp with time zone)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id as community_id,
        c.name as community_name,
        c.description as community_description,
        c.member_count as community_member_count,
        ufc.created_at as favorited_at
    FROM user_favorite_communities ufc
    JOIN communities c ON ufc.community_id = c.id
    WHERE ufc.user_id = user_uuid
    ORDER BY ufc.created_at DESC;
END;
$$;


ALTER FUNCTION "public"."get_user_favorite_communities"("user_uuid" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_favorite_events"("user_uuid" "uuid") RETURNS TABLE("event_id" "uuid", "event_name" character varying, "event_description" "text", "event_date" timestamp with time zone, "favorited_at" timestamp with time zone)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id as event_id,
        e.name as event_name,
        e.description as event_description,
        e.date as event_date,
        ufe.created_at as favorited_at
    FROM user_favorite_events ufe
    JOIN events e ON ufe.event_id = e.id
    WHERE ufe.user_id = user_uuid
    ORDER BY ufe.created_at DESC;
END;
$$;


ALTER FUNCTION "public"."get_user_favorite_events"("user_uuid" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_favorite_locations"("user_uuid" "uuid") RETURNS TABLE("location_id" "uuid", "location_name" character varying, "location_description" "text", "location_address" character varying, "location_rating" numeric, "favorited_at" timestamp with time zone)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        l.id as location_id,
        l.name as location_name,
        l.description as location_description,
        l.address as location_address,
        l.rating as location_rating,
        ufl.created_at as favorited_at
    FROM user_favorite_locations ufl
    JOIN locations l ON ufl.location_id = l.id
    WHERE ufl.user_id = user_uuid
    ORDER BY ufl.created_at DESC;
END;
$$;


ALTER FUNCTION "public"."get_user_favorite_locations"("user_uuid" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."join_community"("community_id_param" integer, "user_uuid" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    INSERT INTO community_members (community_id, user_id, role)
    VALUES (community_id_param, user_uuid, 'member')
    ON CONFLICT (community_id, user_id) DO NOTHING;
    
    RETURN FOUND;
END;
$$;


ALTER FUNCTION "public"."join_community"("community_id_param" integer, "user_uuid" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."leave_community"("community_id_param" integer, "user_uuid" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    DELETE FROM community_members 
    WHERE community_id = community_id_param AND user_id = user_uuid;
    
    RETURN FOUND;
END;
$$;


ALTER FUNCTION "public"."leave_community"("community_id_param" integer, "user_uuid" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."toggle_favorite_community"("user_uuid" "uuid", "community_uuid" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    is_favorited BOOLEAN;
BEGIN
    -- Check if already favorited
    SELECT EXISTS(
        SELECT 1 FROM user_favorite_communities 
        WHERE user_id = user_uuid AND community_id = community_uuid
    ) INTO is_favorited;
    
    IF is_favorited THEN
        -- Remove from favorites
        DELETE FROM user_favorite_communities 
        WHERE user_id = user_uuid AND community_id = community_uuid;
        RETURN FALSE;
    ELSE
        -- Add to favorites
        INSERT INTO user_favorite_communities (user_id, community_id)
        VALUES (user_uuid, community_uuid);
        RETURN TRUE;
    END IF;
END;
$$;


ALTER FUNCTION "public"."toggle_favorite_community"("user_uuid" "uuid", "community_uuid" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."toggle_favorite_event"("user_uuid" "uuid", "event_uuid" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    is_favorited BOOLEAN;
BEGIN
    -- Check if already favorited
    SELECT EXISTS(
        SELECT 1 FROM user_favorite_events 
        WHERE user_id = user_uuid AND event_id = event_uuid
    ) INTO is_favorited;
    
    IF is_favorited THEN
        -- Remove from favorites
        DELETE FROM user_favorite_events 
        WHERE user_id = user_uuid AND event_id = event_uuid;
        RETURN FALSE;
    ELSE
        -- Add to favorites
        INSERT INTO user_favorite_events (user_id, event_id)
        VALUES (user_uuid, event_uuid);
        RETURN TRUE;
    END IF;
END;
$$;


ALTER FUNCTION "public"."toggle_favorite_event"("user_uuid" "uuid", "event_uuid" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."toggle_favorite_location"("user_uuid" "uuid", "location_uuid" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    is_favorited BOOLEAN;
BEGIN
    -- Check if already favorited
    SELECT EXISTS(
        SELECT 1 FROM user_favorite_locations 
        WHERE user_id = user_uuid AND location_id = location_uuid
    ) INTO is_favorited;
    
    IF is_favorited THEN
        -- Remove from favorites
        DELETE FROM user_favorite_locations 
        WHERE user_id = user_uuid AND location_id = location_uuid;
        RETURN FALSE;
    ELSE
        -- Add to favorites
        INSERT INTO user_favorite_locations (user_id, location_id)
        VALUES (user_uuid, location_uuid);
        RETURN TRUE;
    END IF;
END;
$$;


ALTER FUNCTION "public"."toggle_favorite_location"("user_uuid" "uuid", "location_uuid" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_community_member_count"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE communities 
        SET member_count = member_count + 1 
        WHERE id = NEW.community_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE communities 
        SET member_count = member_count - 1 
        WHERE id = OLD.community_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."update_community_member_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_discussion_reply_count"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.community_discussions SET reply_count = reply_count + 1 WHERE id = NEW.discussion_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.community_discussions SET reply_count = reply_count - 1 WHERE id = OLD.discussion_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."update_discussion_reply_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_event_attendee_count"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.events SET current_attendees = current_attendees + 1 WHERE id = NEW.event_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.events SET current_attendees = current_attendees - 1 WHERE id = OLD.event_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."update_event_attendee_count"() OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying(255) NOT NULL,
    "description" "text",
    "date" timestamp with time zone NOT NULL,
    "location_id" "uuid",
    "category_id" "uuid",
    "event_type_id" "uuid",
    "is_free" boolean DEFAULT true,
    "time" character varying(100),
    "capacity" integer,
    "organizer" character varying(255),
    "contact" character varying(255),
    "website" character varying(255),
    "price" character varying(100),
    "requirements" "text"[],
    "highlights" "text"[],
    "long_description" "text",
    "is_featured" boolean DEFAULT false,
    "rating" numeric(3,2) DEFAULT 0.0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "image_url" "text",
    "attendees" "uuid"[] DEFAULT ARRAY[]::"uuid"[],
    "owner_id" "uuid"
);


ALTER TABLE "public"."events" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_event_details"("p_event_id" "uuid", "p_time" character varying, "p_capacity" integer, "p_organizer" character varying, "p_contact" character varying, "p_website" character varying, "p_price" character varying, "p_requirements" "text"[], "p_highlights" "text"[], "p_long_description" "text", "p_is_featured" boolean, "p_rating" numeric, "p_image_url" "text", "p_image_path" "text") RETURNS SETOF "public"."events"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  UPDATE events
  SET 
    time = p_time,
    capacity = p_capacity,
    organizer = p_organizer,
    contact = p_contact,
    website = p_website,
    price = p_price,
    requirements = p_requirements,
    highlights = p_highlights,
    long_description = p_long_description,
    is_featured = p_is_featured,
    rating = p_rating,
    image_url = p_image_url,
    image_path = p_image_path,
    updated_at = NOW()
  WHERE id = p_event_id
  RETURNING *;
END;
$$;


ALTER FUNCTION "public"."update_event_details"("p_event_id" "uuid", "p_time" character varying, "p_capacity" integer, "p_organizer" character varying, "p_contact" character varying, "p_website" character varying, "p_price" character varying, "p_requirements" "text"[], "p_highlights" "text"[], "p_long_description" "text", "p_is_featured" boolean, "p_rating" numeric, "p_image_url" "text", "p_image_path" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_events_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_events_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_location_rating"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.locations 
        SET rating = (
            SELECT AVG(rating)::DECIMAL(3,2) 
            FROM public.location_reviews 
            WHERE location_id = NEW.location_id
        ),
        review_count = (
            SELECT COUNT(*) 
            FROM public.location_reviews 
            WHERE location_id = NEW.location_id
        )
        WHERE id = NEW.location_id;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE public.locations 
        SET rating = (
            SELECT AVG(rating)::DECIMAL(3,2) 
            FROM public.location_reviews 
            WHERE location_id = NEW.location_id
        )
        WHERE id = NEW.location_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.locations 
        SET rating = (
            SELECT AVG(rating)::DECIMAL(3,2) 
            FROM public.location_reviews 
            WHERE location_id = OLD.location_id
        ),
        review_count = (
            SELECT COUNT(*) 
            FROM public.location_reviews 
            WHERE location_id = OLD.location_id
        )
        WHERE id = OLD.location_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."update_location_rating"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_locations_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_locations_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."user_avatars_access_policy"() RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN (SELECT id FROM auth.users WHERE id = auth.uid()) IS NOT NULL;
END;
$$;


ALTER FUNCTION "public"."user_avatars_access_policy"() OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."event_types" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying(100) NOT NULL,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."event_types" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."locations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying(255) NOT NULL,
    "description" "text",
    "address" character varying(500),
    "lat" numeric(10,8),
    "lng" numeric(11,8),
    "open_hour" integer,
    "close_hour" integer,
    "days_open" character varying(100),
    "phone" character varying(50),
    "website" character varying(255),
    "tags" "text"[],
    "price" character varying(100),
    "best_time" character varying(255),
    "tips" "text"[],
    "rating" numeric(3,2) DEFAULT 0.0,
    "review_count" integer DEFAULT 0,
    "is_featured" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "image_url" "text"
);


ALTER TABLE "public"."locations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_event_history" (
    "user_id" "uuid" NOT NULL,
    "event_id" "uuid" NOT NULL,
    "visited_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"())
);


ALTER TABLE "public"."user_event_history" OWNER TO "postgres";


CREATE MATERIALIZED VIEW "private"."event_details" AS
 SELECT "e"."id",
    "e"."name",
    "e"."description",
    "e"."date",
    "e"."time",
    "l"."id" AS "location_id",
    "l"."name" AS "location_name",
    "c"."id" AS "category_id",
    "c"."name" AS "category_name",
    "et"."id" AS "event_type_id",
    "et"."name" AS "event_type_name",
    "e"."is_free",
    "e"."price",
    "e"."image_url",
    "e"."capacity",
    "e"."organizer",
    "e"."contact",
    "e"."website",
    "e"."requirements",
    "e"."highlights",
    "e"."long_description",
    "e"."is_featured",
    "e"."rating",
    ( SELECT "count"(*) AS "count"
           FROM "public"."user_event_history" "ueh"
          WHERE ("ueh"."event_id" = "e"."id")) AS "attendees_count",
    "e"."created_at",
    "e"."updated_at"
   FROM ((("public"."events" "e"
     LEFT JOIN "public"."locations" "l" ON (("e"."location_id" = "l"."id")))
     LEFT JOIN "public"."categories" "c" ON (("e"."category_id" = "c"."id")))
     LEFT JOIN "public"."event_types" "et" ON (("e"."event_type_id" = "et"."id")))
  WITH NO DATA;


ALTER TABLE "private"."event_details" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."categories_backup" (
    "id" integer,
    "name" "text",
    "slug" "text",
    "description" "text",
    "color" "text",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."categories_backup" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."comments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "discussion_id" "uuid",
    "user_id" "uuid",
    "parent_comment_id" "uuid",
    "content" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."comments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."communities_backup" (
    "id" integer,
    "name" character varying(255),
    "description" "text",
    "image" character varying(500),
    "address" character varying(255),
    "created_by" "uuid",
    "member_count" integer,
    "is_public" boolean,
    "is_featured" boolean,
    "tags" "text"[],
    "website" character varying(500),
    "contact_email" character varying(255),
    "contact_phone" character varying(50),
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."communities_backup" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."community_members" (
    "community_id" "uuid",
    "user_id" "uuid",
    "role" character varying(50) DEFAULT 'member'::character varying,
    "joined_at" timestamp with time zone DEFAULT "now"(),
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    CONSTRAINT "community_members_role_check" CHECK ((("role")::"text" = ANY ((ARRAY['admin'::character varying, 'moderator'::character varying, 'member'::character varying])::"text"[])))
);


ALTER TABLE "public"."community_members" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."discussions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "community_id" "uuid",
    "user_id" "uuid",
    "title" character varying(255) NOT NULL,
    "content" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "link_url" "text",
    "link_title" "text",
    "tags" "uuid"[]
);


ALTER TABLE "public"."discussions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."event_attendees" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "status" "text" DEFAULT 'going'::"text" NOT NULL,
    "registered_at" timestamp with time zone DEFAULT "now"(),
    "check_in_time" timestamp with time zone,
    "feedback_rating" integer,
    "feedback_comment" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."event_attendees" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."event_details" WITH ("security_invoker"='true') AS
 SELECT "e"."id",
    "e"."name",
    "e"."description",
    "e"."date",
    "e"."time",
    "e"."location_id",
    "l"."name" AS "location_name",
    "l"."address" AS "location_address",
    "e"."category_id",
    "c"."name" AS "category_name",
    "e"."event_type_id",
    "et"."name" AS "event_type_name",
    "e"."is_free",
    "e"."price",
    "e"."image_url",
    "e"."capacity",
    "e"."organizer",
    "e"."contact",
    "e"."website",
    "e"."requirements",
    "e"."highlights",
    "e"."long_description",
    "e"."is_featured",
    "e"."rating",
    ( SELECT "count"(*) AS "count"
           FROM "public"."event_attendees" "ea"
          WHERE ("ea"."event_id" = "e"."id")) AS "attendees_count",
    "e"."created_at",
    "e"."updated_at"
   FROM ((("public"."events" "e"
     LEFT JOIN "public"."locations" "l" ON (("e"."location_id" = "l"."id")))
     LEFT JOIN "public"."categories" "c" ON (("e"."category_id" = "c"."id")))
     LEFT JOIN "public"."event_types" "et" ON (("e"."event_type_id" = "et"."id")));


ALTER TABLE "public"."event_details" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."event_types_backup" (
    "id" integer,
    "name" "text",
    "slug" "text",
    "description" "text",
    "is_free" boolean,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."event_types_backup" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."events_backup" (
    "id" integer,
    "name" "text",
    "description" "text",
    "long_description" "text",
    "date" "date",
    "time" time without time zone,
    "location_id" integer,
    "location_text" "text",
    "category_id" integer,
    "category" "text",
    "event_type_id" integer,
    "type" "text",
    "fee" boolean,
    "price" numeric(10,2),
    "currency" "text",
    "image" "text",
    "capacity" integer,
    "current_attendees" integer,
    "organizer_id" "uuid",
    "organizer_name" "text",
    "contact_email" "text",
    "contact_phone" "text",
    "website" "text",
    "requirements" "text"[],
    "highlights" "text"[],
    "tags" "text"[],
    "is_featured" boolean,
    "status" "text",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."events_backup" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."events_with_details" AS
 SELECT "e"."id",
    "e"."name",
    "e"."description",
    "e"."date",
    "e"."location_id",
    "e"."category_id",
    "e"."event_type_id",
    "e"."is_free",
    "e"."time",
    "e"."capacity",
    "e"."organizer",
    "e"."contact",
    "e"."website",
    "e"."price",
    "e"."requirements",
    "e"."highlights",
    "e"."long_description",
    "e"."is_featured",
    "e"."rating",
    "e"."created_at",
    "e"."updated_at",
    "e"."image_url",
    "l"."name" AS "location_name",
    "c"."name" AS "category_name"
   FROM (("public"."events" "e"
     LEFT JOIN "public"."locations" "l" ON (("e"."location_id" = "l"."id")))
     LEFT JOIN "public"."categories" "c" ON (("e"."category_id" = "c"."id")));


ALTER TABLE "public"."events_with_details" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."events_with_details_v2" WITH ("security_invoker"='true') AS
 SELECT "e"."id" AS "event_id",
    "e"."name" AS "event_name",
    "e"."description" AS "event_description",
    "e"."date",
    "e"."is_free",
    "e"."image_url" AS "event_image_url",
    "e"."is_featured",
    "e"."rating",
    "c"."id" AS "category_id",
    "c"."name" AS "category_name",
    "c"."color" AS "category_color",
    "l"."id" AS "location_id",
    "l"."name" AS "location_name",
    "l"."address" AS "location_address",
    "l"."lat",
    "l"."lng",
    "et"."id" AS "event_type_id",
    "et"."name" AS "event_type_name"
   FROM ((("public"."events" "e"
     LEFT JOIN "public"."categories" "c" ON (("e"."category_id" = "c"."id")))
     LEFT JOIN "public"."locations" "l" ON (("e"."location_id" = "l"."id")))
     LEFT JOIN "public"."event_types" "et" ON (("e"."event_type_id" = "et"."id")))
  ORDER BY "e"."date";


ALTER TABLE "public"."events_with_details_v2" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."interactions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "discussion_id" "uuid",
    "comment_id" "uuid",
    "interaction_type" character varying(20),
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "interactions_interaction_type_check" CHECK ((("interaction_type")::"text" = ANY ((ARRAY['like'::character varying, 'dislike'::character varying])::"text"[])))
);


ALTER TABLE "public"."interactions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."interest_types" (
    "id" bigint NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "category_id" "uuid",
    "community_type_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."interest_types" OWNER TO "postgres";


ALTER TABLE "public"."interest_types" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."interest_types_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."locations_backup" (
    "id" integer,
    "name" "text",
    "description" "text",
    "address" "text",
    "lat" numeric(10,8),
    "lng" numeric(11,8),
    "image" "text",
    "rating" numeric(3,2),
    "review_count" integer,
    "tags" "text"[],
    "is_featured" boolean,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."locations_backup" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."preference_types" (
    "id" bigint NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "data_type" "text" NOT NULL,
    "default_value" boolean,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."preference_types" OWNER TO "postgres";


ALTER TABLE "public"."preference_types" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."preference_types_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."resources" (
    "id" integer NOT NULL,
    "title" character varying(255) NOT NULL,
    "description" "text",
    "url" character varying(512) NOT NULL,
    "category" character varying(100) NOT NULL,
    "icon_name" character varying(100),
    "badge" character varying(50),
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."resources" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."resources_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."resources_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."resources_id_seq" OWNED BY "public"."resources"."id";



CREATE TABLE IF NOT EXISTS "public"."user_communities" (
    "user_id" "uuid" NOT NULL,
    "community_id" "uuid" NOT NULL,
    "joined_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"())
);


ALTER TABLE "public"."user_communities" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_favorite_communities" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "community_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_favorite_communities" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_favorite_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "event_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_favorite_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_favorite_locations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "location_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_favorite_locations" OWNER TO "postgres";


ALTER TABLE ONLY "public"."resources" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."resources_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."communities"
    ADD CONSTRAINT "communities_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."community_members"
    ADD CONSTRAINT "community_members_community_id_user_id_key" UNIQUE ("community_id", "user_id");



ALTER TABLE ONLY "public"."community_members"
    ADD CONSTRAINT "community_members_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."community_types"
    ADD CONSTRAINT "community_types_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."discussions"
    ADD CONSTRAINT "discussions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."event_attendees"
    ADD CONSTRAINT "event_attendees_event_id_user_id_key" UNIQUE ("event_id", "user_id");



ALTER TABLE ONLY "public"."event_attendees"
    ADD CONSTRAINT "event_attendees_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."event_types"
    ADD CONSTRAINT "event_types_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."interactions"
    ADD CONSTRAINT "interactions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."interactions"
    ADD CONSTRAINT "interactions_user_id_discussion_id_comment_id_key" UNIQUE ("user_id", "discussion_id", "comment_id");



ALTER TABLE ONLY "public"."interest_types"
    ADD CONSTRAINT "interest_types_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."interest_types"
    ADD CONSTRAINT "interest_types_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."locations"
    ADD CONSTRAINT "locations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."preference_types"
    ADD CONSTRAINT "preference_types_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."preference_types"
    ADD CONSTRAINT "preference_types_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_username_key" UNIQUE ("username");



ALTER TABLE ONLY "public"."resources"
    ADD CONSTRAINT "resources_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_communities"
    ADD CONSTRAINT "user_communities_pkey" PRIMARY KEY ("user_id", "community_id");



ALTER TABLE ONLY "public"."user_event_history"
    ADD CONSTRAINT "user_event_history_pkey" PRIMARY KEY ("user_id", "event_id");



ALTER TABLE ONLY "public"."user_favorite_communities"
    ADD CONSTRAINT "user_favorite_communities_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_favorite_communities"
    ADD CONSTRAINT "user_favorite_communities_user_id_community_id_key" UNIQUE ("user_id", "community_id");



ALTER TABLE ONLY "public"."user_favorite_events"
    ADD CONSTRAINT "user_favorite_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_favorite_events"
    ADD CONSTRAINT "user_favorite_events_user_id_event_id_key" UNIQUE ("user_id", "event_id");



ALTER TABLE ONLY "public"."user_favorite_locations"
    ADD CONSTRAINT "user_favorite_locations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_favorite_locations"
    ADD CONSTRAINT "user_favorite_locations_user_id_location_id_key" UNIQUE ("user_id", "location_id");



CREATE UNIQUE INDEX "idx_event_details_id" ON "private"."event_details" USING "btree" ("id");



CREATE INDEX "idx_categories_created_at" ON "public"."categories" USING "btree" ("created_at");



CREATE INDEX "idx_categories_name" ON "public"."categories" USING "btree" ("name");



CREATE INDEX "idx_communities_category_id" ON "public"."communities" USING "btree" ("category_id");



CREATE INDEX "idx_communities_community_type_id" ON "public"."communities" USING "btree" ("community_type_id");



CREATE INDEX "idx_communities_created_at" ON "public"."communities" USING "btree" ("created_at");



CREATE INDEX "idx_communities_is_featured" ON "public"."communities" USING "btree" ("is_featured");



CREATE INDEX "idx_communities_is_public" ON "public"."communities" USING "btree" ("is_public");



CREATE INDEX "idx_communities_member_count" ON "public"."communities" USING "btree" ("member_count");



CREATE INDEX "idx_communities_name" ON "public"."communities" USING "btree" ("name");



CREATE INDEX "idx_communities_organizer_id" ON "public"."communities" USING "btree" ("organizer_id");



CREATE INDEX "idx_community_members_community_id" ON "public"."community_members" USING "btree" ("community_id");



CREATE INDEX "idx_community_members_user_id" ON "public"."community_members" USING "btree" ("user_id");



CREATE INDEX "idx_event_attendees_event_id" ON "public"."event_attendees" USING "btree" ("event_id");



CREATE INDEX "idx_event_attendees_user_id" ON "public"."event_attendees" USING "btree" ("user_id");



CREATE INDEX "idx_event_types_created_at" ON "public"."event_types" USING "btree" ("created_at");



CREATE INDEX "idx_event_types_name" ON "public"."event_types" USING "btree" ("name");



CREATE INDEX "idx_events_category_id" ON "public"."events" USING "btree" ("category_id");



CREATE INDEX "idx_events_created_at" ON "public"."events" USING "btree" ("created_at");



CREATE INDEX "idx_events_date" ON "public"."events" USING "btree" ("date");



CREATE INDEX "idx_events_event_type_id" ON "public"."events" USING "btree" ("event_type_id");



CREATE INDEX "idx_events_is_featured" ON "public"."events" USING "btree" ("is_featured");



CREATE INDEX "idx_events_location_id" ON "public"."events" USING "btree" ("location_id");



CREATE INDEX "idx_events_name" ON "public"."events" USING "btree" ("name");



CREATE INDEX "idx_events_owner_id" ON "public"."events" USING "btree" ("owner_id");



CREATE INDEX "idx_events_rating" ON "public"."events" USING "btree" ("rating");



CREATE INDEX "idx_interest_types_name" ON "public"."interest_types" USING "btree" ("name");



CREATE INDEX "idx_locations_address" ON "public"."locations" USING "btree" ("address");



CREATE INDEX "idx_locations_created_at" ON "public"."locations" USING "btree" ("created_at");



CREATE INDEX "idx_locations_is_featured" ON "public"."locations" USING "btree" ("is_featured");



CREATE INDEX "idx_locations_name" ON "public"."locations" USING "btree" ("name");



CREATE INDEX "idx_locations_rating" ON "public"."locations" USING "btree" ("rating");



CREATE INDEX "idx_preference_types_name" ON "public"."preference_types" USING "btree" ("name");



CREATE INDEX "idx_profiles_country" ON "public"."profiles" USING "btree" ("country");



CREATE INDEX "idx_profiles_email" ON "public"."profiles" USING "btree" ("email");



CREATE INDEX "idx_profiles_interests" ON "public"."profiles" USING "gin" ("interests");



CREATE INDEX "idx_profiles_phone_number" ON "public"."profiles" USING "btree" ("phone_number");



CREATE INDEX "idx_resources_active" ON "public"."resources" USING "btree" ("is_active");



CREATE INDEX "idx_resources_category" ON "public"."resources" USING "btree" ("category");



CREATE INDEX "idx_user_favorite_communities_community_id" ON "public"."user_favorite_communities" USING "btree" ("community_id");



CREATE INDEX "idx_user_favorite_communities_created_at" ON "public"."user_favorite_communities" USING "btree" ("created_at");



CREATE INDEX "idx_user_favorite_communities_user_id" ON "public"."user_favorite_communities" USING "btree" ("user_id");



CREATE INDEX "idx_user_favorite_events_created_at" ON "public"."user_favorite_events" USING "btree" ("created_at");



CREATE INDEX "idx_user_favorite_events_event_id" ON "public"."user_favorite_events" USING "btree" ("event_id");



CREATE INDEX "idx_user_favorite_events_user_id" ON "public"."user_favorite_events" USING "btree" ("user_id");



CREATE INDEX "idx_user_favorite_locations_created_at" ON "public"."user_favorite_locations" USING "btree" ("created_at");



CREATE INDEX "idx_user_favorite_locations_location_id" ON "public"."user_favorite_locations" USING "btree" ("location_id");



CREATE INDEX "idx_user_favorite_locations_user_id" ON "public"."user_favorite_locations" USING "btree" ("user_id");



CREATE INDEX "profiles_user_id_idx" ON "public"."profiles" USING "btree" ("id");



CREATE OR REPLACE TRIGGER "refresh_event_details_trigger" AFTER INSERT OR DELETE OR UPDATE ON "public"."events" FOR EACH STATEMENT EXECUTE FUNCTION "private"."refresh_event_details"();



CREATE OR REPLACE TRIGGER "refresh_event_details_trigger_categories" AFTER INSERT OR DELETE OR UPDATE ON "public"."categories" FOR EACH STATEMENT EXECUTE FUNCTION "private"."refresh_event_details"();



CREATE OR REPLACE TRIGGER "refresh_event_details_trigger_locations" AFTER INSERT OR DELETE OR UPDATE ON "public"."locations" FOR EACH STATEMENT EXECUTE FUNCTION "private"."refresh_event_details"();



CREATE OR REPLACE TRIGGER "trigger_update_community_member_count" AFTER INSERT OR DELETE ON "public"."community_members" FOR EACH ROW EXECUTE FUNCTION "public"."update_community_member_count"();



CREATE OR REPLACE TRIGGER "update_categories_updated_at" BEFORE UPDATE ON "public"."categories" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_communities_updated_at" BEFORE UPDATE ON "public"."communities" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_event_types_updated_at" BEFORE UPDATE ON "public"."event_types" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_events_updated_at" BEFORE UPDATE ON "public"."events" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_locations_updated_at" BEFORE UPDATE ON "public"."locations" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_resources_updated_at" BEFORE UPDATE ON "public"."resources" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_discussion_id_fkey" FOREIGN KEY ("discussion_id") REFERENCES "public"."discussions"("id");



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_parent_comment_id_fkey" FOREIGN KEY ("parent_comment_id") REFERENCES "public"."comments"("id");



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."communities"
    ADD CONSTRAINT "communities_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id");



ALTER TABLE ONLY "public"."communities"
    ADD CONSTRAINT "communities_community_type_id_fkey" FOREIGN KEY ("community_type_id") REFERENCES "public"."community_types"("id");



ALTER TABLE ONLY "public"."communities"
    ADD CONSTRAINT "communities_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."community_members"
    ADD CONSTRAINT "community_members_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "public"."communities"("id");



ALTER TABLE ONLY "public"."community_members"
    ADD CONSTRAINT "community_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."discussions"
    ADD CONSTRAINT "discussions_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "public"."communities"("id");



ALTER TABLE ONLY "public"."discussions"
    ADD CONSTRAINT "discussions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."event_attendees"
    ADD CONSTRAINT "event_attendees_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."event_attendees"
    ADD CONSTRAINT "event_attendees_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_event_type_id_fkey" FOREIGN KEY ("event_type_id") REFERENCES "public"."event_types"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."interactions"
    ADD CONSTRAINT "interactions_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id");



ALTER TABLE ONLY "public"."interactions"
    ADD CONSTRAINT "interactions_discussion_id_fkey" FOREIGN KEY ("discussion_id") REFERENCES "public"."discussions"("id");



ALTER TABLE ONLY "public"."interactions"
    ADD CONSTRAINT "interactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."interest_types"
    ADD CONSTRAINT "interest_types_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id");



ALTER TABLE ONLY "public"."interest_types"
    ADD CONSTRAINT "interest_types_community_type_id_fkey" FOREIGN KEY ("community_type_id") REFERENCES "public"."community_types"("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_communities"
    ADD CONSTRAINT "user_communities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_event_history"
    ADD CONSTRAINT "user_event_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_favorite_communities"
    ADD CONSTRAINT "user_favorite_communities_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "public"."communities"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_favorite_communities"
    ADD CONSTRAINT "user_favorite_communities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_favorite_events"
    ADD CONSTRAINT "user_favorite_events_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_favorite_events"
    ADD CONSTRAINT "user_favorite_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_favorite_locations"
    ADD CONSTRAINT "user_favorite_locations_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_favorite_locations"
    ADD CONSTRAINT "user_favorite_locations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



CREATE POLICY "Allow admins to manage community_types" ON "public"."community_types" TO "authenticated" USING (((( SELECT ("auth"."jwt"() ->> 'app_metadata'::"text")))::"jsonb" @> '{"role": "admin"}'::"jsonb")) WITH CHECK (((( SELECT ("auth"."jwt"() ->> 'app_metadata'::"text")))::"jsonb" @> '{"role": "admin"}'::"jsonb"));



CREATE POLICY "Allow public read access to community_types" ON "public"."community_types" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Allow public read access to resources" ON "public"."resources" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Allow users to view interest types" ON "public"."interest_types" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow users to view preference types" ON "public"."preference_types" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can create communities" ON "public"."communities" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Authenticated users can create events" ON "public"."events" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Categories are viewable by everyone" ON "public"."categories" FOR SELECT USING (true);



CREATE POLICY "Communities are viewable by everyone" ON "public"."communities" FOR SELECT USING (true);



CREATE POLICY "Event organizers can manage attendees" ON "public"."event_attendees" TO "authenticated" USING (("event_id" IN ( SELECT "e"."id"
   FROM (("public"."events" "e"
     JOIN "public"."communities" "c" ON (("e"."category_id" = "c"."category_id")))
     JOIN "public"."community_members" "cm" ON (("c"."id" = "cm"."community_id")))
  WHERE (("cm"."user_id" = ( SELECT "auth"."uid"() AS "uid")) AND (("cm"."role")::"text" = ANY ((ARRAY['admin'::character varying, 'moderator'::character varying])::"text"[])))))) WITH CHECK (("event_id" IN ( SELECT "e"."id"
   FROM (("public"."events" "e"
     JOIN "public"."communities" "c" ON (("e"."category_id" = "c"."category_id")))
     JOIN "public"."community_members" "cm" ON (("c"."id" = "cm"."community_id")))
  WHERE (("cm"."user_id" = ( SELECT "auth"."uid"() AS "uid")) AND (("cm"."role")::"text" = ANY ((ARRAY['admin'::character varying, 'moderator'::character varying])::"text"[]))))));



CREATE POLICY "Event types are viewable by everyone" ON "public"."event_types" FOR SELECT USING (true);



CREATE POLICY "Events are viewable by everyone" ON "public"."events" FOR SELECT USING (true);



CREATE POLICY "Locations are viewable by everyone" ON "public"."locations" FOR SELECT USING (true);



CREATE POLICY "Only administrators can modify interest types" ON "public"."interest_types" TO "authenticated" USING (((("auth"."jwt"() ->> 'app_metadata'::"text"))::"jsonb" ? 'is_admin'::"text")) WITH CHECK (((("auth"."jwt"() ->> 'app_metadata'::"text"))::"jsonb" ? 'is_admin'::"text"));



CREATE POLICY "Only administrators can modify preference types" ON "public"."preference_types" TO "authenticated" USING (((("auth"."jwt"() ->> 'app_metadata'::"text"))::"jsonb" ? 'is_admin'::"text")) WITH CHECK (((("auth"."jwt"() ->> 'app_metadata'::"text"))::"jsonb" ? 'is_admin'::"text"));



CREATE POLICY "Users can delete own events" ON "public"."events" FOR DELETE USING (("auth"."uid"() = "owner_id"));



CREATE POLICY "Users can insert own profile" ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users can manage their own community favorites" ON "public"."user_favorite_communities" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their own community memberships." ON "public"."user_communities" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their own event favorites" ON "public"."user_favorite_events" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their own event history." ON "public"."user_event_history" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their own location favorites" ON "public"."user_favorite_locations" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can register for events" ON "public"."event_attendees" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Users can update own profile" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can update their own attendance" ON "public"."event_attendees" FOR UPDATE TO "authenticated" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid"))) WITH CHECK (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Users can update their own profile" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users can view their own community favorites" ON "public"."user_favorite_communities" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own community memberships." ON "public"."user_communities" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own event attendance" ON "public"."event_attendees" FOR SELECT TO "authenticated" USING ((("user_id" = ( SELECT "auth"."uid"() AS "uid")) OR ("event_id" IN ( SELECT "e"."id"
   FROM ("public"."events" "e"
     JOIN "public"."communities" "c" ON (("e"."category_id" = "c"."category_id")))
  WHERE ("c"."is_public" = true)))));



CREATE POLICY "Users can view their own event history." ON "public"."user_event_history" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own favorites" ON "public"."user_favorite_events" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own location favorites" ON "public"."user_favorite_locations" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own profile" ON "public"."profiles" FOR SELECT USING (("auth"."uid"() = "id"));



ALTER TABLE "public"."categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."communities" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."community_members" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."community_types" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."event_attendees" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."event_types" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."interest_types" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."locations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."preference_types" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."resources" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_communities" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_event_history" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_favorite_communities" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_favorite_events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_favorite_locations" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_in"("cstring") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_in"("cstring") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_in"("cstring") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_in"("cstring") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_out"("public"."gtrgm") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_out"("public"."gtrgm") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_out"("public"."gtrgm") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_out"("public"."gtrgm") TO "service_role";

























































































































































GRANT ALL ON TABLE "public"."categories" TO "anon";
GRANT ALL ON TABLE "public"."categories" TO "authenticated";
GRANT ALL ON TABLE "public"."categories" TO "service_role";



GRANT ALL ON TABLE "public"."communities" TO "anon";
GRANT ALL ON TABLE "public"."communities" TO "authenticated";
GRANT ALL ON TABLE "public"."communities" TO "service_role";



GRANT ALL ON TABLE "public"."community_types" TO "anon";
GRANT ALL ON TABLE "public"."community_types" TO "authenticated";
GRANT ALL ON TABLE "public"."community_types" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."community_details" TO "anon";
GRANT ALL ON TABLE "public"."community_details" TO "authenticated";
GRANT ALL ON TABLE "public"."community_details" TO "service_role";



GRANT ALL ON FUNCTION "public"."get_communities_by_classification"("p_category_id" "uuid", "p_community_type_id" "uuid", "p_limit" integer, "p_offset" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_communities_by_classification"("p_category_id" "uuid", "p_community_type_id" "uuid", "p_limit" integer, "p_offset" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_communities_by_classification"("p_category_id" "uuid", "p_community_type_id" "uuid", "p_limit" integer, "p_offset" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_event_by_id"("event_id_param" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_event_by_id"("event_id_param" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_event_by_id"("event_id_param" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_events_with_details_v2"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_events_with_details_v2"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_events_with_details_v2"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_location_names_and_ids"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_location_names_and_ids"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_location_names_and_ids"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_communities"("user_uuid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_communities"("user_uuid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_communities"("user_uuid" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_events"("p_user_id" "uuid", "p_status" "text", "p_from_date" timestamp with time zone, "p_to_date" timestamp with time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_events"("p_user_id" "uuid", "p_status" "text", "p_from_date" timestamp with time zone, "p_to_date" timestamp with time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_events"("p_user_id" "uuid", "p_status" "text", "p_from_date" timestamp with time zone, "p_to_date" timestamp with time zone) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_favorite_communities"("user_uuid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_favorite_communities"("user_uuid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_favorite_communities"("user_uuid" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_favorite_events"("user_uuid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_favorite_events"("user_uuid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_favorite_events"("user_uuid" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_favorite_locations"("user_uuid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_favorite_locations"("user_uuid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_favorite_locations"("user_uuid" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_query_trgm"("text", "internal", smallint, "internal", "internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_query_trgm"("text", "internal", smallint, "internal", "internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_query_trgm"("text", "internal", smallint, "internal", "internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_query_trgm"("text", "internal", smallint, "internal", "internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_value_trgm"("text", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_value_trgm"("text", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_value_trgm"("text", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_value_trgm"("text", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_trgm_consistent"("internal", smallint, "text", integer, "internal", "internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_trgm_consistent"("internal", smallint, "text", integer, "internal", "internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_trgm_consistent"("internal", smallint, "text", integer, "internal", "internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_trgm_consistent"("internal", smallint, "text", integer, "internal", "internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_trgm_triconsistent"("internal", smallint, "text", integer, "internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_trgm_triconsistent"("internal", smallint, "text", integer, "internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_trgm_triconsistent"("internal", smallint, "text", integer, "internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_trgm_triconsistent"("internal", smallint, "text", integer, "internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_compress"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_compress"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_compress"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_compress"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_consistent"("internal", "text", smallint, "oid", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_consistent"("internal", "text", smallint, "oid", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_consistent"("internal", "text", smallint, "oid", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_consistent"("internal", "text", smallint, "oid", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_decompress"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_decompress"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_decompress"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_decompress"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_distance"("internal", "text", smallint, "oid", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_distance"("internal", "text", smallint, "oid", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_distance"("internal", "text", smallint, "oid", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_distance"("internal", "text", smallint, "oid", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_options"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_options"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_options"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_options"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_penalty"("internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_penalty"("internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_penalty"("internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_penalty"("internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_picksplit"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_picksplit"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_picksplit"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_picksplit"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_same"("public"."gtrgm", "public"."gtrgm", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_same"("public"."gtrgm", "public"."gtrgm", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_same"("public"."gtrgm", "public"."gtrgm", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_same"("public"."gtrgm", "public"."gtrgm", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_union"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_union"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_union"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_union"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."join_community"("community_id_param" integer, "user_uuid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."join_community"("community_id_param" integer, "user_uuid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."join_community"("community_id_param" integer, "user_uuid" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."leave_community"("community_id_param" integer, "user_uuid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."leave_community"("community_id_param" integer, "user_uuid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."leave_community"("community_id_param" integer, "user_uuid" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."set_limit"(real) TO "postgres";
GRANT ALL ON FUNCTION "public"."set_limit"(real) TO "anon";
GRANT ALL ON FUNCTION "public"."set_limit"(real) TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_limit"(real) TO "service_role";



GRANT ALL ON FUNCTION "public"."show_limit"() TO "postgres";
GRANT ALL ON FUNCTION "public"."show_limit"() TO "anon";
GRANT ALL ON FUNCTION "public"."show_limit"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."show_limit"() TO "service_role";



GRANT ALL ON FUNCTION "public"."show_trgm"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."show_trgm"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."show_trgm"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."show_trgm"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."similarity"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."similarity"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."similarity"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."similarity"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."similarity_dist"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."similarity_dist"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."similarity_dist"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."similarity_dist"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."similarity_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."similarity_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."similarity_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."similarity_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."strict_word_similarity"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."strict_word_similarity"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."strict_word_similarity"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strict_word_similarity"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."strict_word_similarity_commutator_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_commutator_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_commutator_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_commutator_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_commutator_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_commutator_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_commutator_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_commutator_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."strict_word_similarity_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."toggle_favorite_community"("user_uuid" "uuid", "community_uuid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."toggle_favorite_community"("user_uuid" "uuid", "community_uuid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."toggle_favorite_community"("user_uuid" "uuid", "community_uuid" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."toggle_favorite_event"("user_uuid" "uuid", "event_uuid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."toggle_favorite_event"("user_uuid" "uuid", "event_uuid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."toggle_favorite_event"("user_uuid" "uuid", "event_uuid" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."toggle_favorite_location"("user_uuid" "uuid", "location_uuid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."toggle_favorite_location"("user_uuid" "uuid", "location_uuid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."toggle_favorite_location"("user_uuid" "uuid", "location_uuid" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_community_member_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_community_member_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_community_member_count"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_discussion_reply_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_discussion_reply_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_discussion_reply_count"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_event_attendee_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_event_attendee_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_event_attendee_count"() TO "service_role";



GRANT ALL ON TABLE "public"."events" TO "anon";
GRANT ALL ON TABLE "public"."events" TO "authenticated";
GRANT ALL ON TABLE "public"."events" TO "service_role";



GRANT ALL ON FUNCTION "public"."update_event_details"("p_event_id" "uuid", "p_time" character varying, "p_capacity" integer, "p_organizer" character varying, "p_contact" character varying, "p_website" character varying, "p_price" character varying, "p_requirements" "text"[], "p_highlights" "text"[], "p_long_description" "text", "p_is_featured" boolean, "p_rating" numeric, "p_image_url" "text", "p_image_path" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."update_event_details"("p_event_id" "uuid", "p_time" character varying, "p_capacity" integer, "p_organizer" character varying, "p_contact" character varying, "p_website" character varying, "p_price" character varying, "p_requirements" "text"[], "p_highlights" "text"[], "p_long_description" "text", "p_is_featured" boolean, "p_rating" numeric, "p_image_url" "text", "p_image_path" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_event_details"("p_event_id" "uuid", "p_time" character varying, "p_capacity" integer, "p_organizer" character varying, "p_contact" character varying, "p_website" character varying, "p_price" character varying, "p_requirements" "text"[], "p_highlights" "text"[], "p_long_description" "text", "p_is_featured" boolean, "p_rating" numeric, "p_image_url" "text", "p_image_path" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_events_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_events_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_events_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_location_rating"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_location_rating"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_location_rating"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_locations_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_locations_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_locations_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."user_avatars_access_policy"() TO "anon";
GRANT ALL ON FUNCTION "public"."user_avatars_access_policy"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."user_avatars_access_policy"() TO "service_role";



GRANT ALL ON FUNCTION "public"."word_similarity"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."word_similarity"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."word_similarity"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."word_similarity"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."word_similarity_commutator_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."word_similarity_commutator_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."word_similarity_commutator_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."word_similarity_commutator_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."word_similarity_dist_commutator_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_commutator_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_commutator_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_commutator_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."word_similarity_dist_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."word_similarity_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."word_similarity_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."word_similarity_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."word_similarity_op"("text", "text") TO "service_role";


















GRANT ALL ON TABLE "public"."event_types" TO "anon";
GRANT ALL ON TABLE "public"."event_types" TO "authenticated";
GRANT ALL ON TABLE "public"."event_types" TO "service_role";



GRANT ALL ON TABLE "public"."locations" TO "anon";
GRANT ALL ON TABLE "public"."locations" TO "authenticated";
GRANT ALL ON TABLE "public"."locations" TO "service_role";



GRANT ALL ON TABLE "public"."user_event_history" TO "anon";
GRANT ALL ON TABLE "public"."user_event_history" TO "authenticated";
GRANT ALL ON TABLE "public"."user_event_history" TO "service_role";



GRANT ALL ON TABLE "public"."categories_backup" TO "anon";
GRANT ALL ON TABLE "public"."categories_backup" TO "authenticated";
GRANT ALL ON TABLE "public"."categories_backup" TO "service_role";



GRANT ALL ON TABLE "public"."comments" TO "anon";
GRANT ALL ON TABLE "public"."comments" TO "authenticated";
GRANT ALL ON TABLE "public"."comments" TO "service_role";



GRANT ALL ON TABLE "public"."communities_backup" TO "anon";
GRANT ALL ON TABLE "public"."communities_backup" TO "authenticated";
GRANT ALL ON TABLE "public"."communities_backup" TO "service_role";



GRANT ALL ON TABLE "public"."community_members" TO "anon";
GRANT ALL ON TABLE "public"."community_members" TO "authenticated";
GRANT ALL ON TABLE "public"."community_members" TO "service_role";



GRANT ALL ON TABLE "public"."discussions" TO "anon";
GRANT ALL ON TABLE "public"."discussions" TO "authenticated";
GRANT ALL ON TABLE "public"."discussions" TO "service_role";



GRANT ALL ON TABLE "public"."event_attendees" TO "anon";
GRANT ALL ON TABLE "public"."event_attendees" TO "authenticated";
GRANT ALL ON TABLE "public"."event_attendees" TO "service_role";



GRANT ALL ON TABLE "public"."event_details" TO "anon";
GRANT ALL ON TABLE "public"."event_details" TO "authenticated";
GRANT ALL ON TABLE "public"."event_details" TO "service_role";



GRANT ALL ON TABLE "public"."event_types_backup" TO "anon";
GRANT ALL ON TABLE "public"."event_types_backup" TO "authenticated";
GRANT ALL ON TABLE "public"."event_types_backup" TO "service_role";



GRANT ALL ON TABLE "public"."events_backup" TO "anon";
GRANT ALL ON TABLE "public"."events_backup" TO "authenticated";
GRANT ALL ON TABLE "public"."events_backup" TO "service_role";



GRANT ALL ON TABLE "public"."events_with_details" TO "anon";
GRANT ALL ON TABLE "public"."events_with_details" TO "authenticated";
GRANT ALL ON TABLE "public"."events_with_details" TO "service_role";



GRANT ALL ON TABLE "public"."events_with_details_v2" TO "anon";
GRANT ALL ON TABLE "public"."events_with_details_v2" TO "authenticated";
GRANT ALL ON TABLE "public"."events_with_details_v2" TO "service_role";



GRANT ALL ON TABLE "public"."interactions" TO "anon";
GRANT ALL ON TABLE "public"."interactions" TO "authenticated";
GRANT ALL ON TABLE "public"."interactions" TO "service_role";



GRANT ALL ON TABLE "public"."interest_types" TO "anon";
GRANT ALL ON TABLE "public"."interest_types" TO "authenticated";
GRANT ALL ON TABLE "public"."interest_types" TO "service_role";



GRANT ALL ON SEQUENCE "public"."interest_types_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."interest_types_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."interest_types_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."locations_backup" TO "anon";
GRANT ALL ON TABLE "public"."locations_backup" TO "authenticated";
GRANT ALL ON TABLE "public"."locations_backup" TO "service_role";



GRANT ALL ON TABLE "public"."preference_types" TO "anon";
GRANT ALL ON TABLE "public"."preference_types" TO "authenticated";
GRANT ALL ON TABLE "public"."preference_types" TO "service_role";



GRANT ALL ON SEQUENCE "public"."preference_types_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."preference_types_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."preference_types_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."resources" TO "anon";
GRANT ALL ON TABLE "public"."resources" TO "authenticated";
GRANT ALL ON TABLE "public"."resources" TO "service_role";



GRANT ALL ON SEQUENCE "public"."resources_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."resources_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."resources_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."user_communities" TO "anon";
GRANT ALL ON TABLE "public"."user_communities" TO "authenticated";
GRANT ALL ON TABLE "public"."user_communities" TO "service_role";



GRANT ALL ON TABLE "public"."user_favorite_communities" TO "anon";
GRANT ALL ON TABLE "public"."user_favorite_communities" TO "authenticated";
GRANT ALL ON TABLE "public"."user_favorite_communities" TO "service_role";



GRANT ALL ON TABLE "public"."user_favorite_events" TO "anon";
GRANT ALL ON TABLE "public"."user_favorite_events" TO "authenticated";
GRANT ALL ON TABLE "public"."user_favorite_events" TO "service_role";



GRANT ALL ON TABLE "public"."user_favorite_locations" TO "anon";
GRANT ALL ON TABLE "public"."user_favorite_locations" TO "authenticated";
GRANT ALL ON TABLE "public"."user_favorite_locations" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
