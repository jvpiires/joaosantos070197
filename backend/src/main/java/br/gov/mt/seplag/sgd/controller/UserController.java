package br.gov.mt.seplag.sgd.controller;

import br.gov.mt.seplag.sgd.dto.ChangeRoleDTO;
import br.gov.mt.seplag.sgd.dto.UserDTO;
import br.gov.mt.seplag.sgd.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService service;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDTO>> listar() {
        List<UserDTO> users = service.findAll();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDTO> obterPorId(@PathVariable Long id) {
        UserDTO user = service.findById(id);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDTO> alterarRole(
            @PathVariable Long id,
            @RequestBody @Valid ChangeRoleDTO dto) {
        UserDTO user = service.changeRole(id, dto);
        return ResponseEntity.ok(user);
    }
}
