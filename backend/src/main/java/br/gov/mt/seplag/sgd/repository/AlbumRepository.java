package br.gov.mt.seplag.sgd.repository;

import br.gov.mt.seplag.sgd.entity.Album;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlbumRepository extends JpaRepository<Album, Long> {
    
    Page<Album> findByArtistsId(Long artistId, Pageable pageable);
    
    Page<Album> findByTitleContainingIgnoreCase(String title, Pageable pageable);
}
