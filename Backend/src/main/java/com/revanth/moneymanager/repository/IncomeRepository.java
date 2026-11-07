package com.revanth.moneymanager.repository;

import com.revanth.moneymanager.entity.IncomeEntity;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface IncomeRepository extends JpaRepository<IncomeEntity, Long> {

    Optional<IncomeEntity> findByIdAndProfileId(Long id, Long profileId);

    @EntityGraph(attributePaths = "category")
    List<IncomeEntity> findByProfileIdOrderByDateDesc(Long profileId);

    @EntityGraph(attributePaths = "category")
    List<IncomeEntity> findTop5ByProfileIdOrderByDateDesc(Long profileId);

    @Query("SELECT SUM(i.amount) FROM IncomeEntity i WHERE i.profile.id = :profileId")
    BigDecimal findTotalIncomeByProfileId(@Param("profileId") Long profileId);

    @EntityGraph(attributePaths = "category")
    List<IncomeEntity> findByProfileIdAndDateBetweenAndNameContainingIgnoreCase(
            Long profileId, LocalDate startDate, LocalDate endDate, String keyword, Sort sort);

    @EntityGraph(attributePaths = "category")
    List<IncomeEntity> findByProfileIdAndDateBetweenOrderByDateDesc(
            Long profileId, LocalDate startDate, LocalDate endDate);

    boolean existsByCategoryId(Long categoryId);

    @Query("SELECT SUM(i.amount) FROM IncomeEntity i WHERE i.profile.id = :profileId AND i.date BETWEEN :start AND :end")
    BigDecimal findTotalByProfileIdAndDateBetween(@Param("profileId") Long profileId,
                                                  @Param("start") LocalDate start,
                                                  @Param("end") LocalDate end);
}