package br.gov.mt.seplag.sgd.controller;

import br.gov.mt.seplag.sgd.dto.AlbumDTO;
import br.gov.mt.seplag.sgd.service.AlbumService;
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

import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import java.net.URI;

@RestController
@RequestMapping("/api/v1/albums")
@Tag(name = "Álbuns", description = "Endpoints para gerenciamento de Álbuns")
@SecurityRequirement(name = "bearer-key")
public class AlbumController {

    @Autowired
    private AlbumService service;

    @GetMapping
    @Operation(summary = "Listar álbuns", description = "Lista álbuns com paginação. Pode filtrar por 'artistId' ou 'title'.")
    public ResponseEntity<Page<AlbumDTO>> findAll(
            @RequestParam(required = false) Long artistId,
            @RequestParam(required = false) String title,
            @PageableDefault(sort = "title", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        Page<AlbumDTO> page = service.findAll(artistId, title, pageable);
        return ResponseEntity.ok(page);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar por ID", description = "Busca detalhada de um álbum")
    public ResponseEntity<AlbumDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Criar álbum", description = "Cadastra um novo álbum com artistas e imagem")
    public ResponseEntity<AlbumDTO> create(
            @RequestParam String title,
            @RequestParam(required = false) MultipartFile image,
            @RequestParam(required = false) Long[] artistIds
    ) {
        AlbumDTO dto = new AlbumDTO(
            null, 
            title, 
            null, 
            artistIds != null ? java.util.Arrays.asList(artistIds) : null,
            null,
            null
        );
        
        AlbumDTO created = service.create(dto, image, artistIds);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(created.id()).toUri();
        return ResponseEntity.created(uri).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar álbum", description = "Atualiza os dados de um álbum")
    public ResponseEntity<AlbumDTO> update(@PathVariable Long id, @RequestBody @Valid AlbumDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @PostMapping(value = "/{id}/cover", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload de capa", description = "Upload de imagem para a capa do álbum")
    public ResponseEntity<AlbumDTO> uploadCover(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(service.uploadImage(id, file));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir álbum", description = "Remove um álbum do banco de dados")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
