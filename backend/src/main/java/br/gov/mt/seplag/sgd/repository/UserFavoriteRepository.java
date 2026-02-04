package br.gov.mt.seplag.sgd.repository;

import br.gov.mt.seplag.sgd.entity.UserFavorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserFavoriteRepository extends JpaRepository<UserFavorite, Long> {
    
    @Query("SELECT uf FROM UserFavorite uf JOIN FETCH uf.album JOIN FETCH uf.user WHERE uf.user.id = :userId")
    List<UserFavorite> findByUserId(@Param("userId") Long userId);
    
    Optional<UserFavorite> findByUserIdAndAlbumId(Long userId, Long albumId);
    
    boolean existsByUserIdAndAlbumId(Long userId, Long albumId);
    
    void deleteByUserIdAndAlbumId(Long userId, Long albumId);
}