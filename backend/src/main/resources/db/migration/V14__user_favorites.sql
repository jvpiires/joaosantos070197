CREATE TABLE user_favorites (
                                id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                user_id BIGINT NOT NULL,
                                album_id BIGINT NOT NULL,
                                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                UNIQUE KEY unique_user_album (user_id, album_id),
                                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                                FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_id ON user_favorites(user_id);
CREATE INDEX idx_album_id ON user_favorites(album_id);