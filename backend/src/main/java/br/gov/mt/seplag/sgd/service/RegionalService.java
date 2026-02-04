package br.gov.mt.seplag.sgd.service;

import br.gov.mt.seplag.sgd.dto.RegionalDTO;
import br.gov.mt.seplag.sgd.entity.Regional;
import br.gov.mt.seplag.sgd.repository.RegionalRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class RegionalService {

    @Autowired
    private RegionalRepository repository;

    @Autowired
    private RestTemplate restTemplate;

    private static final String EXTERNAL_API_URL = "https://integrador-argus-api.geia.vip/v1/regionais";

    /**
     * Sincroniza regionais com a API externa a cada 30 minutos
     * Lógica:
     * 1) Novo no endpoint → inserir na tabela local
     * 2) Não disponível no endpoint → inativar na tabela local
     * 3) Qualquer atributo alterado → inativar anterior e criar novo
     */
    @Scheduled(fixedDelay = 1800000) // 30 minutos em milisegundos
    public void sincronizarRegionais() {
        log.info("Iniciando sincronização de regionais com a API externa");
        
        try {
            RegionalDTO[] regionaisExternos = restTemplate.getForObject(
                EXTERNAL_API_URL,
                RegionalDTO[].class
            );

            if (regionaisExternos == null || regionaisExternos.length == 0) {
                log.warn("Nenhum regional recebido da API externa");
                return;
            }

            Map<Integer, RegionalDTO> externos = Arrays.stream(regionaisExternos)
                .collect(Collectors.toMap(RegionalDTO::id, r -> r));

            Set<Integer> idsExternos = externos.keySet();

            List<Regional> regionaisAtivos = repository.findAllByAtivoTrue();
            Map<Integer, Regional> locaisMap = regionaisAtivos.stream()
                .collect(Collectors.toMap(Regional::getId, r -> r));

            for (RegionalDTO externo : regionaisExternos) {
                Regional local = locaisMap.get(externo.id());

                if (local == null) {
                    log.info("Novo regional encontrado: ID={}, Nome={}", externo.id(), externo.nome());
                    Regional novoRegional = new Regional();
                    novoRegional.setId(externo.id());
                    novoRegional.setNome(externo.nome());
                    novoRegional.setAtivo(true);
                    repository.save(novoRegional);
                    
                } else if (!local.getNome().equals(externo.nome())) {
                    log.info("Regional alterado: ID={}, Nome anterior: {}, Nome novo: {}", 
                        externo.id(), local.getNome(), externo.nome());
                    
                    local.setAtivo(false);
                    repository.save(local);
                    
                    Regional novoRegional = new Regional();
                    novoRegional.setId(externo.id());
                    novoRegional.setNome(externo.nome());
                    novoRegional.setAtivo(true);
                    repository.save(novoRegional);
                }
            }

            regionaisAtivos.stream()
                .filter(r -> !idsExternos.contains(r.getId()))
                .forEach(r -> {
                    log.info("Regional não encontrado na API externa, inativando: ID={}, Nome={}", 
                        r.getId(), r.getNome());
                    r.setAtivo(false);
                    repository.save(r);
                });

            log.info("Sincronização de regionais concluída com sucesso");

        } catch (Exception e) {
            log.error("Erro ao sincronizar regionais com a API externa", e);
        }
    }


    public List<RegionalDTO> findAllAtivos() {
        return repository.findAllAtivos().stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }


    public Optional<Regional> findById(Integer id) {
        return repository.findById(id);
    }


    public Optional<RegionalDTO> findByIdAndAtivo(Integer id) {
        return repository.findById(id)
            .filter(Regional::getAtivo)
            .map(this::toDTO);
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
