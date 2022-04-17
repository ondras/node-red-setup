#!/bin/sh

cd $(dirname $0)
FILE=PID_GTFS.zip
DIR=static

logger -t gtfs starting and downloading...
wget http://data.pid.cz/$FILE

logger -t gtfs unzipping...
mkdir -p $DIR
unzip -o $FILE -d $DIR
rm $FILE

logger -t gtfs db updating...
sqlite3 gtfs.sqlite ".read gtfs_import.sql"

logger -t gtfs done

