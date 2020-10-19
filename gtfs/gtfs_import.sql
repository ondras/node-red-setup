delete from agency;
delete from stops;
delete from routes;
delete from calendar;
delete from calendar_dates;
delete from trips;
delete from stop_times;
vacuum;
.mode csv
.import static/agency.txt agency --skip 1
.import static/stops.txt stops --skip 1
.import static/routes.txt routes --skip 1
.import static/calendar.txt calendar --skip 1
.import static/calendar_dates.txt calendar_dates --skip 1
.import static/trips.txt trips --skip 1
.import static/stop_times.txt stop_times --skip 1
