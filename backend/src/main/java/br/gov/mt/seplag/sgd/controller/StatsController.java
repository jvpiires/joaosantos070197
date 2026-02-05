package br.gov.mt.seplag.sgd.controller;

import br.gov.mt.seplag.sgd.dto.StatsDTO;
import br.gov.mt.seplag.sgd.service.StatsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/stats")
@Tag(name = "📊 Estatísticas", description = "Endpoints para obter estatísticas do sistema")
@SecurityRequirement(name = "bearer-key")
@RequiredArgsConstructor
public class StatsController {

    private final StatsService statsService;

    @GetMapping
    @Operation(
            summary = "Obter estatísticas do sistema",
            description = "Retorna estatísticas gerais como total de artistas, álbuns, usuários e favoritos"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Estatísticas retornadas com sucesso",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = StatsDTO.class))
            ),
            @ApiResponse(responseCode = "401", description = "Não autenticado")
    })
    public ResponseEntity<StatsDTO> getStats() {
        return ResponseEntity.ok(statsService.getStats());
    }
}
