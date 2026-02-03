package br.gov.mt.seplag.sgd.service;

import br.gov.mt.seplag.sgd.dto.SyncDTO;
import br.gov.mt.seplag.sgd.entity.Sync;
import br.gov.mt.seplag.sgd.repository.SyncRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class SyncService {

    @Autowired
    private SyncRepository repository;

    /**
     * Criar ou atualizar sincronização
     */
    @Transactional
    public SyncDTO createOrUpdate(String idExternal, String entityType, Long entityId, String externalData) {
        Sync sync = repository.findByIdExternal(idExternal)
            .orElse(new Sync());

        sync.setIdExternal(idExternal);
        sync.setEntityType(entityType);
        sync.setEntityId(entityId);
        sync.setExternalData(externalData);
        sync.setStatus("SYNCED");
        sync.setLastSyncAt(LocalDateTime.now());
        sync.setSyncErrorMessage(null);

        Sync saved = repository.save(sync);
        log.info("Sincronização criada/atualizada para {}: {}", entityType, idExternal);
        return toDTO(saved);
    }

    /**
     * Registrar erro de sincronização
     */
    @Transactional
    public SyncDTO recordError(String idExternal, String errorMessage) {
        Sync sync = repository.findByIdExternal(idExternal)
            .orElseThrow(() -> new EntityNotFoundException("Sincronização não encontrada: " + idExternal));

        sync.setStatus("ERROR");
        sync.setSyncErrorMessage(errorMessage);
        sync.setLastSyncAt(LocalDateTime.now());

        Sync saved = repository.save(sync);
        log.error("Erro registrado na sincronização {}: {}", idExternal, errorMessage);
        return toDTO(saved);
    }

    /**
     * Listar todas as sincronizações
     */
    @Transactional(readOnly = true)
    public List<SyncDTO> findAll() {
        return repository.findAll().stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    /**
     * Buscar sincronização por ID
     */
    @Transactional(readOnly = true)
    public SyncDTO findById(Long id) {
        Sync sync = repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Sincronização não encontrada com ID: " + id));
        return toDTO(sync);
    }

    /**
     * Buscar sincronização por ID externo
     */
    @Transactional(readOnly = true)
    public SyncDTO findByIdExternal(String idExternal) {
        Sync sync = repository.findByIdExternal(idExternal)
            .orElseThrow(() -> new EntityNotFoundException("Sincronização não encontrada: " + idExternal));
        return toDTO(sync);
    }

    /**
     * Listar sincronizações por tipo de entidade
     */
    @Transactional(readOnly = true)
    public List<SyncDTO> findByEntityType(String entityType) {
        return repository.findByEntityType(entityType).stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    /**
     * Listar sincronizações por status
     */
    @Transactional(readOnly = true)
    public List<SyncDTO> findByStatus(String status) {
        return repository.findByStatus(status).stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    /**
     * Listar sincronizações pendentes
     */
    @Transactional(readOnly = true)
    public List<SyncDTO> findPending() {
        return findByStatus("PENDING");
    }

    /**
     * Deletar sincronização
     */
    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
        log.info("Sincronização deletada: {}", id);
    }

    private SyncDTO toDTO(Sync sync) {
        return new SyncDTO(
            sync.getId(),
            sync.getIdExternal(),
            sync.getEntityType(),
            sync.getEntityId(),
            sync.getExternalData(),
            sync.getStatus(),
            sync.getLastSyncAt(),
            sync.getSyncErrorMessage(),
            sync.getCreatedAt(),
            sync.getUpdatedAt()
        );
    }
}
