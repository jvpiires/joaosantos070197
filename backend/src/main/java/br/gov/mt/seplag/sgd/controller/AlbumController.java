package br.gov.mt.seplag.sgd.controller;

import br.gov.mt.seplag.sgd.dto.AlbumDTO;
import br.gov.mt.seplag.sgd.service.AlbumService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import org.springframework.web.multipart.MultipartFile;
import java.net.URI;

@RestController
@RequestMapping("/api/v1/albums")
@Tag(name = "💿 Álbuns", description = "Endpoints para gerenciamento de Álbuns")
@SecurityRequirement(name = "bearer-key")
public class AlbumController {

    @Autowired
    private AlbumService service;

    @GetMapping
    @Operation(summary = "Listar álbuns", description = "Lista álbuns com paginação. Pode filtrar por 'artistId' ou 'title'. Ordenação: ?sort=title,asc ou ?sort=title,desc")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autenticado")
    })
    @Parameters(value = {
            @Parameter(name = "artistId", description = "ID do artista para filtrar", example = "1"),
            @Parameter(name = "title", description = "Título do álbum para filtrar", example = "Abbey Road"),
            @Parameter(name = "page", description = "Número da página (começa em 0)", example = "0"),
            @Parameter(name = "size", description = "Quantidade de itens por página", example = "10"),
            @Parameter(name = "sort", description = "Ordenação no formato: propriedade,direção (ex: title,asc)", example = "title,asc")
    })
    public ResponseEntity<Page<AlbumDTO>> findAll(
            @RequestParam(required = false) Long artistId,
            @RequestParam(required = false) String title,
            @PageableDefault(sort = "title", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        Page<AlbumDTO> page = service.findAll(artistId, title, pageable);
        return ResponseEntity.ok(page);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar álbum por ID", description = "Retorna detalhes completos de um álbum")
    public ResponseEntity<AlbumDTO> findById(
            @io.swagger.v3.oas.annotations.Parameter(description = "ID do álbum", example = "1")
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(
        summary = "Criar novo álbum",
        description = "Cadastra um novo álbum com artistas e imagem (opcional)"
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Álbum criado com sucesso"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Dados inválidos"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Não autenticado")
    })
    public ResponseEntity<AlbumDTO> create(
            @io.swagger.v3.oas.annotations.Parameter(description = "Título do álbum", example = "Abbey Road")
            @RequestParam String title,
            
            @io.swagger.v3.oas.annotations.Parameter(description = "Imagem/capa do álbum (PNG, JPG, etc)")
            @RequestParam(required = false) MultipartFile image,
            
            @io.swagger.v3.oas.annotations.Parameter(description = "IDs dos artistas do álbum", example = "1,2")
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

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(
        summary = "Atualizar álbum",
        description = "Atualiza os dados de um álbum com suporte a imagem"
    )
    public ResponseEntity<AlbumDTO> update(
            @io.swagger.v3.oas.annotations.Parameter(description = "ID do álbum", example = "1")
            @PathVariable Long id,
            
            @io.swagger.v3.oas.annotations.Parameter(description = "Novo título do álbum", example = "Abbey Road")
            @RequestParam String title,
            
            @io.swagger.v3.oas.annotations.Parameter(description = "Nova imagem/capa (opcional)")
            @RequestParam(required = false) MultipartFile image,
            
            @io.swagger.v3.oas.annotations.Parameter(description = "IDs dos artistas (opcional)", example = "1,2")
            @RequestParam(required = false) Long[] artistIds
    ) {
        AlbumDTO dto = new AlbumDTO(
            id,
            title,
            null,
            artistIds != null ? java.util.Arrays.asList(artistIds) : null,
            null,
            null
        );
        
        return ResponseEntity.ok(service.update(id, dto, image, artistIds));
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
