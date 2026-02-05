package br.gov.mt.seplag.sgd.service;

import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.UUID;

@Service
public class FileStorageService {

    @Autowired
    private MinioClient minioClient;

    @Value("${sgd.storage.bucket-name}")
    private String bucketName;
    
    @Value("${sgd.storage.public-url}")
    private String publicUrl;

    public String uploadFile(MultipartFile file) {
        try {
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            
            InputStream inputStream = file.getInputStream();
            
            minioClient.putObject(
                PutObjectArgs.builder()
                    .bucket(bucketName)
                    .object(fileName)
                    .stream(inputStream, file.getSize(), -1)
                    .contentType(file.getContentType())
                    .build()
            );
            
            return fileName;
        } catch (Exception e) {
            throw new RuntimeException("Erro ao fazer upload da imagem: " + e.getMessage(), e);
        }
    }

    public String getPresignedUrl(String fileKey) {
        try {
            // Como o bucket está configurado como público, retorna URL direta
            return publicUrl + "/" + bucketName + "/" + fileKey;
        } catch (Exception e) {
            e.printStackTrace(); 
            return null;
        }
    }
}
