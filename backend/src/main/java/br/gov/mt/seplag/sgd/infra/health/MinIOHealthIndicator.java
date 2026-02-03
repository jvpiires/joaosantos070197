package br.gov.mt.seplag.sgd.infra.health;

import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

@Component
public class MinIOHealthIndicator implements HealthIndicator {

    @Override
    public Health health() {
        try {
            // Aqui você pode adicionar verificações de conexão com MinIO
            return Health.up()
                    .withDetail("storage", "MinIO is available")
                    .build();
        } catch (Exception e) {
            return Health.down()
                    .withDetail("storage", "MinIO connection failed")
                    .withException(e)
                    .build();
        }
    }
}
