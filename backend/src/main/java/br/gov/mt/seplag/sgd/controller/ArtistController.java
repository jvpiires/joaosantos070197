package br.gov.mt.seplag.sgd.controller;

import br.gov.mt.seplag.sgd.dto.ArtistDTO;
import br.gov.mt.seplag.sgd.dto.CreateArtistRequest;
import br.gov.mt.seplag.sgd.service.ArtistService;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/api/v1/artists")
@Tag(name = "🎵 Artistas", description = "Endpoints para gerenciamento de Artistas")
@SecurityRequirement(name = "bearer-key")
public class ArtistController {

    @Autowired
    private ArtistService service;
    
    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping
    @Operation(
            summary = "Listar artistas",
            description = "Lista artistas com paginação e filtro opcional por nome. Ordenação: ?sort=name,asc ou ?sort=name,desc"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autenticado")
    })
    @Parameters(value = {
            @Parameter(name = "name", description = "Filtro por nome do artista", example = "Beatles"),
            @Parameter(name = "page", description = "Número da página (começa em 0)", example = "0"),
            @Parameter(name = "size", description = "Quantidade de itens por página", example = "10"),
            @Parameter(name = "sort", description = "Ordenação no formato: propriedade,direção (ex: name,asc)", example = "name,asc")
    })
    public ResponseEntity<Page<ArtistDTO>> findAll(
            @RequestParam(required = false) String name,
            @PageableDefault(sort = "name", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        Page<ArtistDTO> page = service.findAll(name, pageable);
        return ResponseEntity.ok(page);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar artista por ID", description = "Retorna detalhes completos de um artista")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Artista encontrado"),
            @ApiResponse(responseCode = "401", description = "Não autenticado"),
            @ApiResponse(responseCode = "404", description = "Artista não encontrado")
    })
    public ResponseEntity<ArtistDTO> findById(
            @io.swagger.v3.oas.annotations.Parameter(description = "ID do artista", example = "1")
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(
        summary = "Criar novo artista",
        description = """
                Cadastra um novo artista com imagem, ano e álbuns.
                
                ⚠️ IMPORTANTE - Campo 'data' deve ser um JSON válido:
                ```json
                {
                  "name": "The Beatles",
                  "year": 1960,
                  "albumIds": [1, 2, 3]
                }
                ```
                """
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Artista criado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos"),
            @ApiResponse(responseCode = "401", description = "Não autenticado")
    })
    public ResponseEntity<ArtistDTO> create(
            @RequestPart("data") 
            @Schema(
                    description = "Dados do artista em JSON. Cole um JSON válido, não um número simples!",
                    example = "{\"name\":\"The Beatles\",\"year\":1960,\"albumIds\":[]}"
            )
            String dataJson,
            
            @RequestPart(value = "image", required = false)
            @Schema(description = "Imagem/foto do artista (PNG, JPG, etc)")
            MultipartFile image
    ) {
        try {
            CreateArtistRequest request = objectMapper.readValue(dataJson, CreateArtistRequest.class);
            
            ArtistDTO created = service.create(request, image);
            URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                    .buildAndExpand(created.id()).toUri();
            return ResponseEntity.created(uri).body(created);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao processar requisição: " + e.getMessage(), e);
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(
        summary = "Atualizar artista",
        description = """
                Atualiza os dados de um artista existente com suporte a imagem.
                
                ⚠️ IMPORTANTE - Campo 'data' deve ser um JSON válido:
                ```json
                {
                  "name": "The Beatles",
                  "year": 1960,
                  "albumIds": [1, 2, 3]
                }
                ```
                """
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Artista atualizado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos"),
            @ApiResponse(responseCode = "401", description = "Não autenticado"),
            @ApiResponse(responseCode = "404", description = "Artista não encontrado")
    })
    public ResponseEntity<ArtistDTO> update(
            @io.swagger.v3.oas.annotations.Parameter(description = "ID do artista", example = "1")
            @PathVariable Long id,
            
            @RequestPart("data")
            @Schema(
                    description = "Dados do artista em JSON. Cole um JSON válido, não um número simples!",
                    example = "{\"name\":\"The Beatles\",\"year\":1960,\"albumIds\":[]}"
            )
            String dataJson,
            
            @RequestPart(value = "image", required = false)
            @Schema(description = "Nova imagem/foto do artista (PNG, JPG, etc)")
            MultipartFile image
    ) {
        try {
            CreateArtistRequest request = objectMapper.readValue(dataJson, CreateArtistRequest.class);
            ArtistDTO updated = service.update(id, request, image);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao processar requisição: " + e.getMessage(), e);
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir artista", description = "Remove um artista do banco de dados")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
