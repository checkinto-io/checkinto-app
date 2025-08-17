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
  group_id uuid NOT NULL,
  CONSTRAINT attendee_pkey PRIMARY KEY (id),
  CONSTRAINT fk_attendee_group FOREIGN KEY (group_id) REFERENCES public.group(id)
);
CREATE TABLE public.event (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  url_id text NOT NULL,
  title text NOT NULL,
  welcome_message text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  about_presentation text,
  about_workshop text,
  presenter_id uuid NOT NULL,
  group_id uuid NOT NULL,
  venue_id uuid NOT NULL,
  workshop_lead_id uuid NOT NULL,
  group_host_id uuid NOT NULL,
  CONSTRAINT event_pkey PRIMARY KEY (id),
  CONSTRAINT event_url_id_group_id_unique UNIQUE (url_id, group_id),
  CONSTRAINT fk_event_workshop_lead FOREIGN KEY (workshop_lead_id) REFERENCES public.talent(id),
  CONSTRAINT fk_event_venue FOREIGN KEY (venue_id) REFERENCES public.venue(id),
  CONSTRAINT fk_event_presenter FOREIGN KEY (presenter_id) REFERENCES public.talent(id),
  CONSTRAINT fk_event_group FOREIGN KEY (group_id) REFERENCES public.group(id),
  CONSTRAINT fk_event_group_host FOREIGN KEY (group_host_id) REFERENCES public.talent(id)
);
CREATE TABLE public.event_attendee (
  event_id uuid NOT NULL,
  attendee_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  raffle_winner boolean NOT NULL DEFAULT false,
  raffle_round integer CHECK (raffle_round IS NULL OR raffle_round > 0),
  CONSTRAINT event_attendee_pkey PRIMARY KEY (event_id, attendee_id),
  CONSTRAINT event_attendee_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.event(id),
  CONSTRAINT event_attendee_attendee_id_fkey FOREIGN KEY (attendee_id) REFERENCES public.attendee(id)
);
CREATE TABLE public.group (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  learn_more_link text,
  banner text NOT NULL CHECK (banner IS NULL OR length(banner) > 0 AND length(banner) <= 255),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  raffle_winners_to_display integer NOT NULL DEFAULT 1 CHECK (raffle_winners_to_display > 0),
  profilename text NOT NULL UNIQUE,
  favicon text NOT NULL CHECK (favicon IS NULL OR length(favicon) > 0 AND length(favicon) <= 255),
  CONSTRAINT group_pkey PRIMARY KEY (id)
);
CREATE TABLE public.talent (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  learn_more_link text,
  bio text,
  profile_photo text CHECK (profile_photo IS NULL OR length(profile_photo) > 0 AND length(profile_photo) <= 255),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  group_id uuid NOT NULL,
  CONSTRAINT talent_pkey PRIMARY KEY (id),
  CONSTRAINT fk_talent_group FOREIGN KEY (group_id) REFERENCES public.group(id)
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
  group_id uuid NOT NULL,
  CONSTRAINT venue_pkey PRIMARY KEY (id),
  CONSTRAINT fk_venue_group FOREIGN KEY (group_id) REFERENCES public.group(id)
);