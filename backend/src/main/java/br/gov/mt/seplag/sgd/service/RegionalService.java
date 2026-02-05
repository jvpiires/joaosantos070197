package br.gov.mt.seplag.sgd.service;

import br.gov.mt.seplag.sgd.dto.RegionalDTO;
import br.gov.mt.seplag.sgd.dto.RegionalExternaDTO;
import br.gov.mt.seplag.sgd.entity.Regional;
import br.gov.mt.seplag.sgd.repository.RegionalRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.transaction.annotation.Transactional;


import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class RegionalService {

    @Autowired
    private RegionalRepository regionalRepository;

    @Autowired
    private RestTemplate restTemplate;

    private static final String API_URL = "https://integrador-argus-api.geia.vip/v1/regionais";

    /**
     * Sincroniza regionais com a API externa a cada 30 minutos
     * Lógica:
     * 1) Novo no endpoint → inserir na tabela local
     * 2) Não disponível no endpoint → inativar na tabela local
     * 3) Qualquer atributo alterado → inativar anterior e criar novo
     */
    @Scheduled(fixedDelay = 1800000)
    public void sincronizarRegionais() {
        log.info("Iniciando sincronização de regionais com a API externa");

        try {
            RegionalExternaDTO[] regionaisExternas = restTemplate.getForObject(
                API_URL,
                RegionalExternaDTO[].class
            );

            if (regionaisExternas == null || regionaisExternas.length == 0) {
                log.warn("Nenhum regional recebido da API externa");
                return;
            }

            Map<String, RegionalExternaDTO> externasMap = Arrays.stream(regionaisExternas)
                .collect(Collectors.toMap(RegionalExternaDTO::getId, r -> r));

            List<Regional> regionaisLocais = regionalRepository.findAllByAtivoTrue();

            Map<String, Regional> locaisMap = regionaisLocais.stream()
                .collect(Collectors.toMap(Regional::getIdExternal, r -> r));

            externasMap.forEach((idExterno, externa) -> {
                if (!locaisMap.containsKey(idExterno)) {
                    Regional nova = new Regional();
                    nova.setIdExternal(idExterno);
                    nova.setNome(externa.getNome());
                    nova.setAtivo(true);
                    regionalRepository.save(nova);
                }
            });

            locaisMap.forEach((idExterno, local) -> {
                RegionalExternaDTO externa = externasMap.get(idExterno);

                if (externa == null) {
                    local.setAtivo(false);
                    regionalRepository.save(local);
                } else if (!local.getNome().equals(externa.getNome())) {
                    local.setAtivo(false);
                    regionalRepository.save(local);

                    Regional novo = new Regional();
                    novo.setIdExternal(idExterno);
                    novo.setNome(externa.getNome());
                    novo.setAtivo(true);
                    regionalRepository.save(novo);
                }
            });

            log.info("Sincronização de regionais concluída com sucesso");

        } catch (Exception e) {
            log.error("Erro ao sincronizar regionais com a API externa", e);
        }
    }

    public List<RegionalDTO> findAll() {
        return regionalRepository.findAll().stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    public List<RegionalDTO> findAllAtivos() {
        return regionalRepository.findAllAtivos().stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }


    public Optional<Regional> findById(Integer id) {
        return regionalRepository.findById(id);
    }


    public Optional<RegionalDTO> findByIdAndAtivo(Integer id) {
        return regionalRepository.findById(id)
            .filter(Regional::getAtivo)
            .map(this::toDTO);
    }

    public RegionalDTO criar(String nome) {
        Regional regional = new Regional();
        regional.setNome(nome);
        regional.setAtivo(true);
        // idExternal fica null para regionais criados manualmente
        // Isso permite diferenciá-los dos sincronizados com a API externa

        Regional saved = regionalRepository.save(regional);
        return toDTO(saved);
    }

    public Optional<RegionalDTO> alterarStatus(Integer id, Boolean ativo) {
        return regionalRepository.findById(id)
            .map(regional -> {
                regional.setAtivo(ativo);
                Regional saved = regionalRepository.save(regional);
                return toDTO(saved);
            });
    }

    private RegionalDTO toDTO(Regional regional) {
        return new RegionalDTO(
            regional.getId(),
            regional.getIdExternal(),
            regional.getNome(),
            regional.getAtivo(),
            regional.getCreatedAt(),
            regional.getUpdatedAt()
        );
    }
}
