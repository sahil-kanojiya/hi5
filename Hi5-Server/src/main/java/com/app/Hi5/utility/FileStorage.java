package com.app.Hi5.utility;

import com.app.Hi5.utility.enums.FileType;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Component
public class FileStorage {

    private Path baseDirectory;

    @PostConstruct
    public void init() {
        try {
            Resource resource = new ClassPathResource("");
            Path path = Paths.get(resource.getURI()).resolve("static");
            if (!Files.exists(path)) {
                Files.createDirectories(path);
            }
            baseDirectory = path.resolve("resource");
            if (!Files.exists(baseDirectory)) {
                Files.createDirectories(baseDirectory);
            }

            for (FileType fileType : FileType.values()) {
                Path directory = baseDirectory.resolve(fileType.getDirectory());
                if (!Files.exists(directory)) {
                    Files.createDirectories(directory);
                }
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to initialize base directory", e);
        }
    }

    public String saveFile(MultipartFile file, FileType fileType) throws IOException {
        Path directory = baseDirectory.resolve(fileType.getDirectory());
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.lastIndexOf('.') == -1) {
            throw new IOException("Invalid file: no extension found");
        }
        String extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
        String filename = UUID.randomUUID().toString() + extension;
        Path destinationFile = directory.resolve(filename);
        log.info("destination path of file: {}", destinationFile.toAbsolutePath());
        file.transferTo(destinationFile);
        String relativeFilePath = "/resource/" + fileType.getDirectory() + "/" + filename;
        log.info("Saved file: {}", relativeFilePath);
        return relativeFilePath;
    }

    public void deleteFile(String filePath) throws IOException {
        Path fileToDelete = baseDirectory.resolve(filePath.substring(10));
        log.info("trying to delete {}", filePath);
        log.debug("Deleting file from path: {}", fileToDelete.toAbsolutePath());
        if (Files.exists(fileToDelete)) {
            Files.delete(fileToDelete);
            log.info("Deleted file: {}", filePath);
        } else {
            log.warn("unable to delete file: {}", filePath);
            throw new IOException("File not found: " + filePath);
        }
    }
}
