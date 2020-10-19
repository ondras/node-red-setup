drop table if exists stop_times;
drop table if exists trips;
drop table if exists calendar_dates;
drop table if exists calendar;
drop table if exists routes;
drop table if exists stops;
drop table if exists agency;

PRAGMA foreign_keys = ON;

begin;

create table agency (
  agency_id    text PRIMARY KEY,
  agency_name  text NOT NULL,
  agency_url   text NOT NULL,
  agency_timezone    text NOT NULL,
  agency_lang  text,
  agency_phone  text
);


create table stops (
  stop_id    text PRIMARY KEY,
  stop_name  text NOT NULL,
  stop_lat   double precision,
  stop_lon   double precision,
  zone_id    int,
  stop_url   text,
  location_type int,
  parent_station text,
  wheelchair_boarding int,
  level_id text,
  platform_code text

  -- not present in PID
  -- stop_code  text,
  -- stop_desc  text

  -- does not work with empty strings
  -- FOREIGN KEY (parent_station) REFERENCES stops(stop_id)
);


create table routes (
  route_id    text PRIMARY KEY,
  agency_id   text,
  route_short_name  text DEFAULT '',
  route_long_name   text DEFAULT '',
  route_type  int,
  route_url   text,
  route_color text,
  route_text_color text,
  is_night int,

  -- not present in PID
  -- route_desc  text,

  FOREIGN KEY (agency_id) REFERENCES agency(agency_id)
);


create table calendar (
  service_id   text PRIMARY KEY,
  monday int NOT NULL,
  tuesday int NOT NULL,
  wednesday    int NOT NULL,
  thursday     int NOT NULL,
  friday int NOT NULL,
  saturday     int NOT NULL,
  sunday int NOT NULL,
  start_date   date NOT NULL,
  end_date     date NOT NULL
);


create table calendar_dates (
  service_id     text ,
  date     date NOT NULL,
  exception_type int  NOT NULL
);


create table trips (
  route_id text,
  service_id    text,
  trip_id text PRIMARY KEY,
  trip_headsign text,
  trip_short_name text,
  direction_id  int NOT NULL,
  block_id text,
  shape_id text,
  wheelchair_accessible int,
  bikes_allowed int,

  -- pid specific
  exceptional int,
  trip_operation_type int,

  FOREIGN KEY (route_id) REFERENCES routes(route_id)
);


create table stop_times (
  trip_id text,
  arrival_time text,
  departure_time text,
  stop_id text,
  stop_sequence int NOT NULL,
  stop_headsign text,
  pickup_type   int,
  drop_off_type int,
  shape_dist_traveled double precision,

  FOREIGN KEY (trip_id) REFERENCES trips(trip_id),
  FOREIGN KEY (stop_id) REFERENCES stops(stop_id)
);

CREATE INDEX stop_times_stop_id ON stop_times(stop_id);

commit;
