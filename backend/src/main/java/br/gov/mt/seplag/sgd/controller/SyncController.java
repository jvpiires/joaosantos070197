package br.gov.mt.seplag.sgd.controller;

import br.gov.mt.seplag.sgd.dto.SyncDTO;
import br.gov.mt.seplag.sgd.service.SyncService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/syncs")
public class SyncController {

    @Autowired
    private SyncService service;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SyncDTO>> listar() {
        List<SyncDTO> syncs = service.findAll();
        return ResponseEntity.ok(syncs);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SyncDTO> obterPorId(@PathVariable Long id) {
        SyncDTO sync = service.findById(id);
        return ResponseEntity.ok(sync);
    }

    @GetMapping("/external/{idExternal}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SyncDTO> obterPorIdExterno(@PathVariable String idExternal) {
        SyncDTO sync = service.findByIdExternal(idExternal);
        return ResponseEntity.ok(sync);
    }

    @GetMapping("/type/{entityType}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SyncDTO>> listarPorTipo(@PathVariable String entityType) {
        List<SyncDTO> syncs = service.findByEntityType(entityType);
        return ResponseEntity.ok(syncs);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SyncDTO>> listarPorStatus(@PathVariable String status) {
        List<SyncDTO> syncs = service.findByStatus(status);
        return ResponseEntity.ok(syncs);
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SyncDTO>> listarPendentes() {
        List<SyncDTO> syncs = service.findPending();
        return ResponseEntity.ok(syncs);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
