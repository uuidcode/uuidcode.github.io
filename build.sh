#!/usr/bin/env bash

mvn clean package

JPS_BIN="${JAVA_HOME:+$JAVA_HOME/bin/}jps"
RUNNING_PIDS="$("$JPS_BIN" -lv | awk '/stream-1.0-SNAPSHOT\.jar/ {print $1}')"

if [[ -n "$RUNNING_PIDS" ]]; then
  echo "$RUNNING_PIDS" | xargs kill
fi

