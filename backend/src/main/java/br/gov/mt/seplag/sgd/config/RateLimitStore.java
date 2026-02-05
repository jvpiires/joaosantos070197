package br.gov.mt.seplag.sgd.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitStore {
    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();
    
    private static final int AUTHENTICATED_LIMIT = 30;
    
    private static final int IP_LIMIT = 30;

    public Bucket resolveBucket(String key, boolean isAuthenticated) {
        return cache.computeIfAbsent(key, k -> createNewBucket(isAuthenticated));
    }

    private Bucket createNewBucket(boolean isAuthenticated) {
        int limit = isAuthenticated ? AUTHENTICATED_LIMIT : IP_LIMIT;
        Bandwidth limit1 = Bandwidth.classic(limit, Refill.intervally(limit, Duration.ofMinutes(1)));
        return Bucket.builder()
                .addLimit(limit1)
                .build();
    }

    public boolean allowRequest(String key, boolean isAuthenticated) {
        Bucket bucket = resolveBucket(key, isAuthenticated);
        return bucket.tryConsume(1);
    }
}
