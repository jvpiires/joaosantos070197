package br.gov.mt.seplag.sgd.infra.health;

import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

@Component
public class DatabaseHealthIndicator implements HealthIndicator {

    @Override
    public Health health() {
        try {
            return Health.up()
                    .withDetail("database", "PostgreSQL is running")
                    .build();
        } catch (Exception e) {
            return Health.down()
                    .withDetail("database", "PostgreSQL connection failed")
                    .withException(e)
                    .build();
        }
    }
}
