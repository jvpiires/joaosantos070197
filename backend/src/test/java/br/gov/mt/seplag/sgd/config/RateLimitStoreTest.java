package br.gov.mt.seplag.sgd.config;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class RateLimitStoreTest {

    @InjectMocks
    private RateLimitStore rateLimitStore;

    int rateLimite = 30;

    @Test
    void testAllowRequest_WithinLimit() {
        String userId = "user1";
        
        for (int i = 0; i < rateLimite; i++) {
            assertTrue(rateLimitStore.allowRequest(userId, true));
        }
    }

    @Test
    void testAllowRequest_ExceedsLimit() {
        String userId = "user2";
        
        for (int i = 0; i < rateLimite; i++) {
            assertTrue(rateLimitStore.allowRequest(userId, true));
        }
        
        assertFalse(rateLimitStore.allowRequest(userId, true));
    }

    @Test
    void testDifferentUsersHaveSeparateLimits() {
        String user1 = "user1";
        String user2 = "user2";
        
        for (int i = 0; i < rateLimite; i++) {
            assertTrue(rateLimitStore.allowRequest(user1, true));
        }
        
        assertTrue(rateLimitStore.allowRequest(user2, true));
    }
}
