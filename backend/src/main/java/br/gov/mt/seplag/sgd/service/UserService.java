package br.gov.mt.seplag.sgd.service;

import br.gov.mt.seplag.sgd.dto.ChangeRoleDTO;
import br.gov.mt.seplag.sgd.dto.UserDTO;
import br.gov.mt.seplag.sgd.entity.User;
import br.gov.mt.seplag.sgd.enums.UserRole;
import br.gov.mt.seplag.sgd.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class UserService {

    @Autowired
    private UserRepository repository;

    /**
     * Listar todos os usuários
     */
    @Transactional(readOnly = true)
    public List<UserDTO> findAll() {
        return repository.findAll().stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    /**
     * Buscar usuário por ID
     */
    @Transactional(readOnly = true)
    public UserDTO findById(Long id) {
        User user = repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado com ID: " + id));
        return toDTO(user);
    }

    /**
     * Alterar role de um usuário (apenas ADMIN)
     * Permite alterar qualquer usuário, exceto remover o último admin
     */
    @Transactional
    public UserDTO changeRole(Long id, ChangeRoleDTO dto) {
        User user = repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado com ID: " + id));

        // Validar role
        try {
            UserRole newRole = UserRole.valueOf(dto.role().toUpperCase());
            
            // Validação: Não permitir remover o último admin do sistema
            if (user.getRole() == UserRole.ADMIN && newRole == UserRole.USER) {
                long adminCount = repository.findAll().stream()
                    .filter(u -> u.getRole() == UserRole.ADMIN)
                    .count();
                if (adminCount <= 1) {
                    throw new IllegalArgumentException("Não é possível remover o último administrador do sistema");
                }
            }
            
            user.setRole(newRole);
            repository.save(user);
            log.info("Role do usuário {} alterada para {}", user.getLogin(), newRole);
            return toDTO(user);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Role inválida: " + dto.role());
        }
    }

    private UserDTO toDTO(User user) {
        return new UserDTO(
            user.getId(),
            user.getLogin(),
            user.getRole().getRole()
        );
    }
}
