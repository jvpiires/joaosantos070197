package br.gov.mt.seplag.sgd.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Bucket4j;
import io.github.bucket4j.Refill;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitStore {

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    /**
     * Obter ou criar bucket para usuário
     * Limite: 10 requisições por minuto
     */
    public Bucket resolveBucket(String userId) {
        return buckets.computeIfAbsent(userId, key -> createNewBucket());
    }

    private Bucket createNewBucket() {
        return Bucket4j.builder()
            .addLimit(Bandwidth.classic(10, Refill.intervally(10, Duration.ofMinutes(1))))
            .build();
    }

    public boolean allowRequest(String userId) {
        Bucket bucket = resolveBucket(userId);
        return bucket.tryConsume(1);
    }
}
