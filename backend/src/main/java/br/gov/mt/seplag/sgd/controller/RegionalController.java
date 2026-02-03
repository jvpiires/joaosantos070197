package br.gov.mt.seplag.sgd.controller;

import br.gov.mt.seplag.sgd.dto.RegionalDTO;
import br.gov.mt.seplag.sgd.service.RegionalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/regionais")
public class RegionalController {

    @Autowired
    private RegionalService service;

    @GetMapping
    public ResponseEntity<List<RegionalDTO>> listarAtivos() {
        List<RegionalDTO> regionais = service.findAllAtivos();
        return ResponseEntity.ok(regionais);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RegionalDTO> obterPorId(@PathVariable Integer id) {
        return service.findByIdAndAtivo(id)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
