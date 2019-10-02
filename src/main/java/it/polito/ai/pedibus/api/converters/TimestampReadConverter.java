package it.polito.ai.pedibus.api.converters;

import org.springframework.core.convert.converter.Converter;

import java.sql.Timestamp;
import java.util.Date;

public class TimestampReadConverter implements Converter<Date, Timestamp> {
    @Override
    public Timestamp convert(Date date) {
        return new Timestamp(date.getTime());
    }

}
