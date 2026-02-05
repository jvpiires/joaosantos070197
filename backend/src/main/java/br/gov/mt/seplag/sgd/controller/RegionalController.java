package br.gov.mt.seplag.sgd.controller;

import br.gov.mt.seplag.sgd.dto.RegionalDTO;
import br.gov.mt.seplag.sgd.service.RegionalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/regionais")
@Tag(name = "Regionais", description = "Endpoints para gerenciamento de Regionais")
@SecurityRequirement(name = "bearer-key")
public class RegionalController {

    @Autowired
    private RegionalService service;

    @GetMapping
    @Operation(summary = "Listar regionais", description = "Lista todas as regionais (ativos e inativos)")
    public ResponseEntity<List<RegionalDTO>> listar() {
        List<RegionalDTO> regionais = service.findAll();
        return ResponseEntity.ok(regionais);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar por ID", description = "Busca uma regional por ID")
    public ResponseEntity<RegionalDTO> obterPorId(@PathVariable Integer id) {
        return service.findByIdAndAtivo(id)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/sync")
    @Operation(summary = "Sincronizar regionais", description = "Sincroniza regionais com a API externa")
    public ResponseEntity<Map<String, String>> sincronizar() {
        try {
            service.sincronizarRegionais();
            return ResponseEntity.ok(Map.of("message", "Sincronização concluída com sucesso"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Erro ao sincronizar: " + e.getMessage()));
        }
    }

    @PostMapping
    @Operation(summary = "Adicionar regional", description = "Adiciona uma nova regional manualmente")
    public ResponseEntity<RegionalDTO> adicionar(@RequestBody Map<String, String> request) {
        String nome = request.get("nome");
        if (nome == null || nome.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        RegionalDTO dto = service.criar(nome.trim());
        return ResponseEntity.ok(dto);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Alterar status", description = "Ativa ou inativa uma regional")
    public ResponseEntity<RegionalDTO> alterarStatus(
            @PathVariable Integer id,
            @RequestBody Map<String, Boolean> request) {
        Boolean ativo = request.get("ativo");
        if (ativo == null) {
            return ResponseEntity.badRequest().build();
        }
        
        return service.alterarStatus(id, ativo)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
