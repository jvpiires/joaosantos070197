package br.gov.mt.seplag.sgd.controller;

import br.gov.mt.seplag.sgd.dto.ArtistDTO;
import br.gov.mt.seplag.sgd.service.ArtistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/api/v1/artists")
@Tag(name = "Artistas", description = "Endpoints para gerenciamento de Artistas")
@SecurityRequirement(name = "bearer-key") // Integração futura com Swagger
public class ArtistController {

    @Autowired
    private ArtistService service;

    @GetMapping
    @Operation(summary = "Listar artistas", description = "Lista artistas com paginação e filtro opcional por nome (requisito f)")
    public ResponseEntity<Page<ArtistDTO>> findAll(
            @RequestParam(required = false) String name,
            @PageableDefault(sort = "name", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        // O parâmetro 'sort' na URL (?sort=name,desc) vai controlar a ordenação (requisito f)
        Page<ArtistDTO> page = service.findAll(name, pageable);
        return ResponseEntity.ok(page);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar por ID", description = "Busca detalhada de um artista")
    public ResponseEntity<ArtistDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    @Operation(summary = "Criar artista", description = "Cadastra um novo artista")
    public ResponseEntity<ArtistDTO> create(@RequestBody @Valid ArtistDTO dto) {
        ArtistDTO crated = service.create(dto);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(crated.id()).toUri();
        return ResponseEntity.created(uri).body(crated);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar artista", description = "Atualiza os dados de um artista existente")
    public ResponseEntity<ArtistDTO> update(@PathVariable Long id, @RequestBody @Valid ArtistDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir artista", description = "Remove um artista do banco de dados")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
