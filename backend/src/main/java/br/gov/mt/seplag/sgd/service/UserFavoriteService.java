package br.gov.mt.seplag.sgd.service;

import br.gov.mt.seplag.sgd.dto.UserFavoriteDTO;
import br.gov.mt.seplag.sgd.entity.UserFavorite;
import br.gov.mt.seplag.sgd.entity.User;
import br.gov.mt.seplag.sgd.entity.Album;
import br.gov.mt.seplag.sgd.repository.UserFavoriteRepository;
import br.gov.mt.seplag.sgd.repository.UserRepository;
import br.gov.mt.seplag.sgd.repository.AlbumRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserFavoriteService {
    
    @Autowired
    private UserFavoriteRepository favoriteRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AlbumRepository albumRepository;
    
    @Transactional
    public UserFavoriteDTO addFavorite(Long userId, Long albumId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));
        
        Album album = albumRepository.findById(albumId)
            .orElseThrow(() -> new EntityNotFoundException("Álbum não encontrado"));
        
        if (favoriteRepository.existsByUserIdAndAlbumId(userId, albumId)) {
            throw new RuntimeException("Álbum já está nos favoritos");
        }
        
        UserFavorite favorite = new UserFavorite(null, user, album, null);
        favorite = favoriteRepository.save(favorite);
        
        return UserFavoriteDTO.fromEntity(favorite);
    }
    
    @Transactional
    public void removeFavorite(Long userId, Long albumId) {
        if (!favoriteRepository.existsByUserIdAndAlbumId(userId, albumId)) {
            throw new EntityNotFoundException("Favorito não encontrado");
        }
        favoriteRepository.deleteByUserIdAndAlbumId(userId, albumId);
    }
    
    public List<UserFavoriteDTO> getUserFavorites(Long userId) {
        return favoriteRepository.findByUserId(userId).stream()
            .map(UserFavoriteDTO::fromEntity)
            .collect(Collectors.toList());
    }
    
    public boolean isFavorite(Long userId, Long albumId) {
        return favoriteRepository.existsByUserIdAndAlbumId(userId, albumId);
    }
}