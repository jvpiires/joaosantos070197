package br.gov.mt.seplag.sgd.controller;

import br.gov.mt.seplag.sgd.dto.UserFavoriteDTO;
import br.gov.mt.seplag.sgd.service.UserFavoriteService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/favorites")
@CrossOrigin(origins = "*")
public class UserFavoriteController {
    
    @Autowired
    private UserFavoriteService favoriteService;
    
    @PostMapping("/{userId}/{albumId}")
    @Operation(summary = "Adicionar álbum aos favoritos")
    public ResponseEntity<UserFavoriteDTO> addFavorite(@PathVariable Long userId, @PathVariable Long albumId) {
        return ResponseEntity.ok(favoriteService.addFavorite(userId, albumId));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Listar favoritos do usuário")
    public ResponseEntity<List<UserFavoriteDTO>> getUserFavorites(@PathVariable Long userId) {
        return ResponseEntity.ok(favoriteService.getUserFavorites(userId));
    }
    
    @GetMapping("/{userId}/{albumId}")
    @Operation(summary = "Verificar se álbum é favorito")
    public ResponseEntity<Boolean> isFavorite(@PathVariable Long userId, @PathVariable Long albumId) {
        return ResponseEntity.ok(favoriteService.isFavorite(userId, albumId));
    }
}