package br.gov.mt.seplag.sgd.controller;

import br.gov.mt.seplag.sgd.dto.ChangeRoleDTO;
import br.gov.mt.seplag.sgd.dto.UserDTO;
import br.gov.mt.seplag.sgd.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@Tag(name = "👥 Usuários", description = "Endpoints para gerenciamento de usuários (requer autorização)")
@SecurityRequirement(name = "bearer-key")
public class UserController {

    @Autowired
    private UserService service;

    @GetMapping
    @Operation(
            summary = "Listar todos os usuários",
            description = "Retorna lista de todos os usuários cadastrados. Requer autenticação."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Lista de usuários retornada com sucesso",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(responseCode = "401", description = "Não autenticado"),
            @ApiResponse(responseCode = "403", description = "Acesso negado")
    })
    public ResponseEntity<List<UserDTO>> listar() {
        List<UserDTO> users = service.findAll();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Buscar usuário por ID",
            description = "Retorna os detalhes de um usuário específico. Requer autenticação."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Usuário encontrado",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = UserDTO.class))
            ),
            @ApiResponse(responseCode = "401", description = "Não autenticado"),
            @ApiResponse(responseCode = "404", description = "Usuário não encontrado")
    })
    public ResponseEntity<UserDTO> obterPorId(
            @Parameter(description = "ID do usuário", example = "1")
            @PathVariable Long id
    ) {
        UserDTO user = service.findById(id);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{id}/role")
    @Operation(
            summary = "Alterar role do usuário",
            description = "Altera o papel (ADMIN/USER) de um usuário. Requer permissão de ADMIN."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Role alterada com sucesso",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = UserDTO.class))
            ),
            @ApiResponse(responseCode = "401", description = "Não autenticado"),
            @ApiResponse(responseCode = "403", description = "Acesso negado - requer permissão ADMIN"),
            @ApiResponse(responseCode = "404", description = "Usuário não encontrado")
    })
    public ResponseEntity<UserDTO> alterarRole(
            @Parameter(description = "ID do usuário", example = "1")
            @PathVariable Long id,
            @RequestBody @Valid ChangeRoleDTO dto
    ) {
        UserDTO user = service.changeRole(id, dto);
        return ResponseEntity.ok(user);
    }
}
