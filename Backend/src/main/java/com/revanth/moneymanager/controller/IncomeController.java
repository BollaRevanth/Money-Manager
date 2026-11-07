package com.revanth.moneymanager.controller;

import com.revanth.moneymanager.dto.IncomeDTO;
import com.revanth.moneymanager.service.IncomeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/incomes")
public class IncomeController {

    private final IncomeService incomeService;


    @PostMapping
    public ResponseEntity<IncomeDTO> addIncome(@Valid @RequestBody IncomeDTO dto){
        IncomeDTO saved = incomeService.addIncome(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping()
    public ResponseEntity<List<IncomeDTO>> getIncomes(){
        List<IncomeDTO> incomes = incomeService.getAllIncomesForCurrentUser();
        return ResponseEntity.ok(incomes);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIncome(@PathVariable Long id){
        incomeService.deleteIncome(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<IncomeDTO> updateIncome(@PathVariable Long id, @Valid @RequestBody IncomeDTO dto){
        return ResponseEntity.ok(incomeService.updateIncome(id, dto));
    }
}
