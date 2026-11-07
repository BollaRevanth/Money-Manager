package com.revanth.moneymanager.util;

import java.time.LocalDate;
import java.time.ZoneId;

public final class DateUtil {
    public static final ZoneId APP_ZONE = ZoneId.of("Asia/Kolkata");

    private DateUtil(){}

    public static LocalDate today (){
        return LocalDate.now(APP_ZONE);
    }
    
}
