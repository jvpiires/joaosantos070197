package br.gov.mt.seplag.sgd.service;

import br.gov.mt.seplag.sgd.dto.RegionalDTO;
import br.gov.mt.seplag.sgd.entity.Regional;
import br.gov.mt.seplag.sgd.repository.RegionalRepository;
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
class RegionalServiceTest {

    @Mock
    private RegionalRepository repository;

    @InjectMocks
    private RegionalService service;

    private Regional testRegional;

    @BeforeEach
    void setUp() {
        testRegional = new Regional();
        testRegional.setId(1);
        testRegional.setNome("Regional Centro");
        testRegional.setAtivo(true);
    }

    @Test
    void testFindAllAtivos() {
        when(repository.findAllAtivos()).thenReturn(List.of(testRegional));

        List<RegionalDTO> result = service.findAllAtivos();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Regional Centro", result.get(0).nome());
        assertTrue(result.get(0).ativo());
    }

    @Test
    void testFindById() {
        when(repository.findById(1)).thenReturn(Optional.of(testRegional));

        Optional<RegionalDTO> result = service.findByIdAndAtivo(1);

        assertTrue(result.isPresent());
        assertEquals("Regional Centro", result.get().nome());
    }

    @Test
    void testFindByIdAndAtivo_True() {
        testRegional.setAtivo(true);
        when(repository.findById(1)).thenReturn(Optional.of(testRegional));

        Optional<RegionalDTO> result = service.findByIdAndAtivo(1);

        assertTrue(result.isPresent());
    }

    @Test
    void testFindByIdAndAtivo_False() {
        testRegional.setAtivo(false);
        when(repository.findById(1)).thenReturn(Optional.of(testRegional));

        Optional<RegionalDTO> result = service.findByIdAndAtivo(1);

        assertFalse(result.isPresent());
    }
}
