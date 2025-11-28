package com.starfund.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "project_tags", indexes = {
    @Index(name = "idx_project_id", columnList = "project_id"),
    @Index(name = "idx_tag_name", columnList = "tag_name")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectTag {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    @JsonIgnore
    private Project project;
    
    @NotBlank(message = "Tag không được để trống")
    @Column(name = "tag_name", length = 100, nullable = false)
    private String tagName;
}
