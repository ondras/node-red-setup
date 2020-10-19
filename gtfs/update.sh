#!/bin/sh

cd $(dirname $0)
FILE=PID_GTFS.zip
DIR=static

wget http://data.pid.cz/$FILE
mkdir -p $DIR
unzip -o $FILE -d $DIR
rm $FILE

sqlite3 gtfs.sqlite ".read gtfs_import.sql"
