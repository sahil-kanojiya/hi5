package com.app.hi5.utility;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class Conversion {

    private Conversion() {}

    public static long convertToMilliseconds(String timeString) {
        log.info("Converting time string: {}", timeString);

        String[] parts = timeString.split(" ");
        double time = Double.parseDouble(parts[0]);
        String unit = parts[1].toLowerCase();

        log.debug("Parsed time: {} and unit: {}", time, unit);

        long milliseconds =
                switch (unit) {
                    case "day", "days" -> {
                        long result = (long) (time * 24 * 60 * 60 * 1000);
                        log.debug("Converted {} days to {} milliseconds", time, result);
                        yield result;
                    }
                    case "hour", "hours" -> {
                        long result = (long) (time * 60 * 60 * 1000);
                        log.debug("Converted {} hours to {} milliseconds", time, result);
                        yield result;
                    }
                    case "minute", "minutes" -> {
                        long result = (long) (time * 60 * 1000);
                        log.debug("Converted {} minutes to {} milliseconds", time, result);
                        yield result;
                    }
                    case "second", "seconds" -> {
                        long result = (long) (time * 1000);
                        log.debug("Converted {} seconds to {} milliseconds", time, result);
                        yield result;
                    }
                    default -> {
                        log.warn("Unknown unit: {}", unit);
                        long result = (long) time; // Default case
                        log.debug("Returning default time in milliseconds: {}", result);
                        yield result;
                    }
                };

        log.info("Converted time string to milliseconds: {}", milliseconds);
        return milliseconds;
    }
}
