package br.gov.mt.seplag.sgd.controller;

import br.gov.mt.seplag.sgd.dto.UserFavoriteDTO;
import br.gov.mt.seplag.sgd.service.UserFavoriteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/favorites")
@CrossOrigin(origins = "*")
@Tag(name = "❤️ Favoritos", description = "Endpoints para gerenciar álbuns favoritos do usuário")
@SecurityRequirement(name = "bearer-key")
public class UserFavoriteController {
    
    @Autowired
    private UserFavoriteService favoriteService;
    
    @PostMapping("/{userId}/{albumId}")
    @Operation(
            summary = "Adicionar álbum aos favoritos",
            description = "Marca um álbum como favorito para o usuário"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Álbum adicionado aos favoritos com sucesso",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = UserFavoriteDTO.class))
            ),
            @ApiResponse(responseCode = "401", description = "Não autenticado"),
            @ApiResponse(responseCode = "404", description = "Usuário ou álbum não encontrado")
    })
    public ResponseEntity<UserFavoriteDTO> addFavorite(
            @Parameter(description = "ID do usuário", example = "1")
            @PathVariable Long userId,
            @Parameter(description = "ID do álbum", example = "1")
            @PathVariable Long albumId
    ) {
        return ResponseEntity.ok(favoriteService.addFavorite(userId, albumId));
    }

    @GetMapping("/user/{userId}")
    @Operation(
            summary = "Listar álbuns favoritos do usuário",
            description = "Retorna lista de todos os álbuns marcados como favoritos pelo usuário"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Lista de favoritos retornada com sucesso"
            ),
            @ApiResponse(responseCode = "401", description = "Não autenticado"),
            @ApiResponse(responseCode = "404", description = "Usuário não encontrado")
    })
    public ResponseEntity<List<UserFavoriteDTO>> getUserFavorites(
            @Parameter(description = "ID do usuário", example = "1")
            @PathVariable Long userId
    ) {
        return ResponseEntity.ok(favoriteService.getUserFavorites(userId));
    }
    
    @GetMapping("/{userId}/{albumId}")
    @Operation(
            summary = "Verificar se álbum é favorito",
            description = "Verifica se um álbum específico está marcado como favorito"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Status de favorito retornado",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = Boolean.class))
            ),
            @ApiResponse(responseCode = "401", description = "Não autenticado"),
            @ApiResponse(responseCode = "404", description = "Usuário ou álbum não encontrado")
    })
    public ResponseEntity<Boolean> isFavorite(
            @Parameter(description = "ID do usuário", example = "1")
            @PathVariable Long userId,
            @Parameter(description = "ID do álbum", example = "1")
            @PathVariable Long albumId
    ) {
        return ResponseEntity.ok(favoriteService.isFavorite(userId, albumId));
    }
}