package br.gov.mt.seplag.sgd.service;

import br.gov.mt.seplag.sgd.dto.UserDTO;
import br.gov.mt.seplag.sgd.dto.ChangeRoleDTO;
import br.gov.mt.seplag.sgd.entity.User;
import br.gov.mt.seplag.sgd.enums.UserRole;
import br.gov.mt.seplag.sgd.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setLogin("testuser");
        testUser.setPassword("encrypted_password");
        testUser.setRole(UserRole.USER);
    }

    @Test
    void testFindAllUsers() {
        when(userRepository.findAll()).thenReturn(List.of(testUser));

        List<UserDTO> result = userService.findAll();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("testuser", result.get(0).login());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void testFindUserById() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        UserDTO result = userService.findById(1L);

        assertNotNull(result);
        assertEquals("testuser", result.login());
        assertEquals("USER", result.role());
        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    void testChangeUserRole() {
        testUser.setRole(UserRole.USER);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.save(testUser)).thenReturn(testUser);

        ChangeRoleDTO dto = new ChangeRoleDTO("ADMIN");
        UserDTO result = userService.changeRole(1L, dto);

        assertNotNull(result);
        assertEquals("ADMIN", result.role());
        assertEquals(UserRole.ADMIN, testUser.getRole());
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void testChangeUserRoleWithInvalidRole() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        ChangeRoleDTO dto = new ChangeRoleDTO("INVALID_ROLE");

        assertThrows(IllegalArgumentException.class, () -> userService.changeRole(1L, dto));
    }
}
