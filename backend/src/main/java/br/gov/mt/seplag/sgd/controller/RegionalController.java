package br.gov.mt.seplag.sgd.controller;

import br.gov.mt.seplag.sgd.dto.RegionalDTO;
import br.gov.mt.seplag.sgd.service.RegionalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/regionais")
@Tag(name = "🌍 Regionais", description = "Endpoints para gerenciamento de regionais/filiais (requer autenticação)")
@SecurityRequirement(name = "bearer-key")
public class RegionalController {

    @Autowired
    private RegionalService service;

    @GetMapping
    @Operation(
            summary = "Listar todas as regionais",
            description = "Retorna lista de todas as regionais cadastradas (ativas e inativas)"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autenticado")
    })
    public ResponseEntity<List<RegionalDTO>> listar() {
        List<RegionalDTO> regionais = service.findAll();
        return ResponseEntity.ok(regionais);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar regional por ID", description = "Retorna os detalhes de uma regional específica")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Regional encontrada"),
            @ApiResponse(responseCode = "401", description = "Não autenticado"),
            @ApiResponse(responseCode = "404", description = "Regional não encontrada")
    })
    public ResponseEntity<RegionalDTO> obterPorId(
            @Parameter(description = "ID da regional", example = "1")
            @PathVariable Integer id
    ) {
        return service.findByIdAndAtivo(id)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/sync")
    @Operation(
            summary = "Sincronizar regionais",
            description = "Sincroniza as regionais com a API externa de origem"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Sincronização realizada com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autenticado"),
            @ApiResponse(responseCode = "500", description = "Erro ao sincronizar")
    })
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
    @Operation(
            summary = "Criar nova regional",
            description = "Adiciona uma nova regional manualmente. Exemplo: {\"nome\": \"Cuiabá\"}"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Regional criada com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autenticado"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos")
    })
    public ResponseEntity<RegionalDTO> adicionar(@RequestBody Map<String, String> request) {
        String nome = request.get("nome");
        if (nome == null || nome.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        RegionalDTO dto = service.criar(nome.trim());
        return ResponseEntity.ok(dto);
    }

    @PatchMapping("/{id}/status")
    @Operation(
            summary = "Alterar status da regional",
            description = "Ativa ou inativa uma regional. Exemplo: {\"ativo\": true}"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Status alterado com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autenticado"),
            @ApiResponse(responseCode = "404", description = "Regional não encontrada"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos")
    })
    public ResponseEntity<RegionalDTO> alterarStatus(
            @Parameter(description = "ID da regional", example = "1")
            @PathVariable Integer id,
            @RequestBody Map<String, Boolean> request
    ) {
        Boolean ativo = request.get("ativo");
        if (ativo == null) {
            return ResponseEntity.badRequest().build();
        }
        
        return service.alterarStatus(id, ativo)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
