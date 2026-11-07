package com.revanth.moneymanager.repository;

import com.revanth.moneymanager.entity.ExpenseEntity;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ExpenseRepository extends JpaRepository<ExpenseEntity, Long> {

    Optional<ExpenseEntity> findByIdAndProfileId(Long id, Long profileId);

    @EntityGraph(attributePaths = "category")
    List<ExpenseEntity> findTop5ByProfileIdOrderByDateDesc(Long profileId);

    @Query("SELECT SUM(e.amount) FROM ExpenseEntity e WHERE e.profile.id = :profileId")
    BigDecimal findTotalExpenseByProfileId(@Param("profileId") Long profileId);

    @EntityGraph(attributePaths = "category")
    List<ExpenseEntity> findByProfileIdAndDateBetweenAndNameContainingIgnoreCase(
            Long profileId, LocalDate startDate, LocalDate endDate, String keyword, Sort sort);

    @EntityGraph(attributePaths = "category")
    List<ExpenseEntity> findByProfileIdAndDateBetweenOrderByDateDesc(
            Long profileId, LocalDate startDate, LocalDate endDate);

    @EntityGraph(attributePaths = "category")
    List<ExpenseEntity> findByProfileIdAndDate(Long profileId, LocalDate date);

    boolean existsByCategoryId(Long categoryId);

    @Query("SELECT SUM(e.amount) FROM ExpenseEntity e WHERE e.profile.id = :profileId AND e.date BETWEEN :start AND :end")
    BigDecimal findTotalByProfileIdAndDateBetween(@Param("profileId") Long profileId,
                                                  @Param("start") LocalDate start,
                                                  @Param("end") LocalDate end);
}