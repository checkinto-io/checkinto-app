-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.attendee (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL UNIQUE,
  interesting_fact text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT attendee_pkey PRIMARY KEY (id)
);
CREATE TABLE public.event (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  url_id text NOT NULL UNIQUE,
  title text NOT NULL,
  welcome_message text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  about_presentation text,
  about_workshop text,
  presenter_id uuid NOT NULL,
  meetup_id uuid NOT NULL,
  venue_id uuid NOT NULL,
  workshop_host_id uuid NOT NULL,
  CONSTRAINT event_pkey PRIMARY KEY (id),
  CONSTRAINT fk_event_venue FOREIGN KEY (venue_id) REFERENCES public.venue(id),
  CONSTRAINT fk_event_presenter FOREIGN KEY (presenter_id) REFERENCES public.presenter(id),
  CONSTRAINT fk_event_workshop_host FOREIGN KEY (workshop_host_id) REFERENCES public.presenter(id),
  CONSTRAINT fk_event_meetup FOREIGN KEY (meetup_id) REFERENCES public.meetup(id)
);
CREATE TABLE public.event_attendee (
  event_id uuid NOT NULL,
  attendee_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT event_attendee_pkey PRIMARY KEY (event_id, attendee_id),
  CONSTRAINT event_attendee_attendee_id_fkey FOREIGN KEY (attendee_id) REFERENCES public.attendee(id),
  CONSTRAINT event_attendee_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.event(id)
);
CREATE TABLE public.meetup (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  learn_more_link text,
  logo text CHECK (logo IS NULL OR length(logo) > 0 AND length(logo) <= 255),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT meetup_pkey PRIMARY KEY (id)
);
CREATE TABLE public.presenter (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  learn_more_link text,
  about_presenter text,
  profile_photo text CHECK (profile_photo IS NULL OR length(profile_photo) > 0 AND length(profile_photo) <= 255),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT presenter_pkey PRIMARY KEY (id)
);
CREATE TABLE public.venue (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  learn_more_link text,
  wifi_access text,
  restroom_details text,
  food_details text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT venue_pkey PRIMARY KEY (id)
);