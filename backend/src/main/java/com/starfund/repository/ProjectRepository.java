package com.starfund.repository;

import com.starfund.model.Project;
import com.starfund.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    
    List<Project> findByFounder(User founder);
    
    List<Project> findByStatus(Project.ProjectStatus status);
    
    Page<Project> findByStatus(Project.ProjectStatus status, Pageable pageable);
    
    List<Project> findByFounderAndStatus(User founder, Project.ProjectStatus status);
    
    @Query("SELECT p FROM Project p WHERE p.status = :status AND " +
           "(:category IS NULL OR p.category = :category) AND " +
           "(:search IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Project> findByFilters(@Param("status") Project.ProjectStatus status,
                                 @Param("category") String category,
                                 @Param("search") String search,
                                 Pageable pageable);
    
    @Query("SELECT p FROM Project p WHERE p.founder = :founder")
    Page<Project> findByFounder(@Param("founder") User founder, Pageable pageable);
    
    @Query("SELECT COUNT(p) FROM Project p WHERE p.status = :status")
    Long countByStatus(@Param("status") Project.ProjectStatus status);

    @Query("SELECT COALESCE(SUM(p.currentAmount), 0) FROM Project p WHERE p.founder = :founder")
    Long sumRaisedByFounder(@Param("founder") User founder);

    @Query("SELECT COUNT(p) FROM Project p WHERE p.founder = :founder AND p.status = :status")
    Long countByFounderAndStatus(@Param("founder") User founder, @Param("status") Project.ProjectStatus status);
    
    @Query("SELECT SUM(p.currentAmount) FROM Project p WHERE p.status = :status")
    Long sumCurrentAmountByStatus(@Param("status") Project.ProjectStatus status);
    
    // FIX: Dùng enum thay vì string 'APPROVED'
    @Query("SELECT p FROM Project p WHERE p.status = com.starfund.model.Project$ProjectStatus.APPROVED ORDER BY p.createdAt DESC")
    List<Project> findTopApprovedProjects(Pageable pageable);
    
    @Query("SELECT p.category, COUNT(p) FROM Project p WHERE p.status = com.starfund.model.Project$ProjectStatus.APPROVED GROUP BY p.category")
    List<Object[]> countProjectsByCategory();
}