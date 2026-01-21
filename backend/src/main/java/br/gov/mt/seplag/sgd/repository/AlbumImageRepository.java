package br.gov.mt.seplag.sgd.repository;

import br.gov.mt.seplag.sgd.entity.AlbumImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlbumImageRepository extends JpaRepository<AlbumImage, Long> {
}
