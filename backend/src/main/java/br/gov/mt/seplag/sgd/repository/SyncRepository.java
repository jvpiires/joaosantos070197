package br.gov.mt.seplag.sgd.repository;

import br.gov.mt.seplag.sgd.entity.Sync;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SyncRepository extends JpaRepository<Sync, Long> {
    
    /**
     * Buscar sincronização por ID externo
     */
    Optional<Sync> findByIdExternal(String idExternal);
    
    /**
     * Buscar sincronizações por tipo de entidade
     */
    List<Sync> findByEntityType(String entityType);
    
    /**
     * Buscar sincronizações por status
     */
    List<Sync> findByStatus(String status);
    
    /**
     * Buscar sincronizações por tipo de entidade e status
     */
    List<Sync> findByEntityTypeAndStatus(String entityType, String status);
    
    /**
     * Buscar sincronização por tipo de entidade e ID da entidade
     */
    Optional<Sync> findByEntityTypeAndEntityId(String entityType, Long entityId);
}
