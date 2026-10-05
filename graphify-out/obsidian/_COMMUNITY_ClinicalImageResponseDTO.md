---
type: community
members: 20
---

# ClinicalImageResponseDTO

**Members:** 20 nodes

## Members
- [[dot-SupabaseStorageAdapter()]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/storage/SupabaseStorageAdapter.java
- [[dot-findByClinicalEntryId()_1]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/ClinicalImageRepository.java
- [[dot-getClinicalPhotos()]] - code - backend/src/main/java/com/clinicadermatologica/app/presentation/controller/MedicalRecordController.java
- [[dot-getImagesByClinicalEntry()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/ClinicalImageService.java
- [[dot-getPublicUrl()]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/storage/SupabaseStorageAdapter.java
- [[dot-mapToDTO()_3]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/ClinicalImageService.java
- [[dot-uploadClinicalImage()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/ClinicalImageService.java
- [[dot-uploadClinicalPhoto()]] - code - backend/src/main/java/com/clinicadermatologica/app/presentation/controller/MedicalRecordController.java
- [[dot-uploadFile()]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/storage/SupabaseStorageAdapter.java
- [[AllArgsConstructor_36]] - code
- [[Builder_33]] - code
- [[ClinicalImageResponseDTO]] - code - backend/src/main/java/com/clinicadermatologica/app/presentation/dto/ClinicalImageResponseDTO.java
- [[ClinicalImageResponseDTO.java]] - code - backend/src/main/java/com/clinicadermatologica/app/presentation/dto/ClinicalImageResponseDTO.java
- [[Getter_36]] - code
- [[NoArgsConstructor_36]] - code
- [[Setter_36]] - code
- [[SupabaseStorageAdapter]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/storage/SupabaseStorageAdapter.java
- [[SupabaseStorageAdapter.java]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/storage/SupabaseStorageAdapter.java
- [[org.springframework.web.multipart.MultipartFile]] - code
- [[org.springframework.web.reactive.function.client.WebClient]] - code

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/ClinicalImageResponseDTO
SORT file.name ASC
```

## Connections to other communities
- 6 edges to [[_COMMUNITY_lombok.extern.slf4j.Slf4j]]
- 6 edges to [[_COMMUNITY_org.springframework.transaction.annotation.Transactional]]
- 4 edges to [[_COMMUNITY_ClinicalImage]]
- 3 edges to [[_COMMUNITY_MedicalRecordController]]
- 3 edges to [[_COMMUNITY_lombok.RequiredArgsConstructor]]
- 2 edges to [[_COMMUNITY_DermatologicService]]
- 2 edges to [[_COMMUNITY_org.springframework.stereotype.Component]]
- 1 edge to [[_COMMUNITY_ClinicalEntryAudit]]
- 1 edge to [[_COMMUNITY_MedicalRecordService]]

## Top bridge nodes
- [[dot-uploadClinicalImage()]] - degree 10, connects to 4 communities
- [[SupabaseStorageAdapter]] - degree 9, connects to 3 communities
- [[dot-getClinicalPhotos()]] - degree 5, connects to 3 communities
- [[dot-uploadClinicalPhoto()]] - degree 6, connects to 2 communities
- [[org.springframework.web.multipart.MultipartFile]] - degree 6, connects to 2 communities