package br.gov.mt.seplag.sgd.repository;

import br.gov.mt.seplag.sgd.entity.Regional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RegionalRepository extends JpaRepository<Regional, Integer> {
    
    @Query("SELECT r FROM Regional r WHERE r.ativo = true ORDER BY r.nome ASC")
    List<Regional> findAllAtivos();
    
    List<Regional> findAllByAtivoTrue();
}
