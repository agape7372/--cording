import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';

class SymptomChips extends StatelessWidget {
  final List<String> symptoms;
  final Set<String> selectedSymptoms;
  final Function(String) onSymptomToggled;

  const SymptomChips({
    super.key,
    required this.symptoms,
    required this.selectedSymptoms,
    required this.onSymptomToggled,
  });

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 10,
      runSpacing: 10,
      children: symptoms.map((symptom) {
        final isSelected = selectedSymptoms.contains(symptom);
        return GestureDetector(
          onTap: () => onSymptomToggled(symptom),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: isSelected ? AppColors.primaryBlue : AppColors.surfaceWhite,
              borderRadius: BorderRadius.circular(25),
              border: Border.all(
                color: isSelected ? AppColors.primaryBlue : AppColors.cardGrey,
                width: 2,
              ),
              boxShadow: isSelected
                  ? [
                      BoxShadow(
                        color: AppColors.primaryBlue.withAlpha(50),
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ]
                  : null,
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  isSelected ? Icons.check_circle : Icons.add_circle_outline,
                  size: 18,
                  color: isSelected ? Colors.white : AppColors.textSecondary,
                ),
                const SizedBox(width: 6),
                Text(
                  symptom,
                  style: TextStyle(
                    color: isSelected ? Colors.white : AppColors.textPrimary,
                    fontWeight: FontWeight.w500,
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }
}

class ChiefComplaintChips extends StatelessWidget {
  final List<String> complaints;
  final Set<String> selectedComplaints;
  final Function(String) onComplaintToggled;
  final int? maxSelection;

  const ChiefComplaintChips({
    super.key,
    required this.complaints,
    required this.selectedComplaints,
    required this.onComplaintToggled,
    this.maxSelection,
  });

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 8,
      runSpacing: 10,
      children: complaints.map((complaint) {
        final isSelected = selectedComplaints.contains(complaint);
        final canSelect = maxSelection == null ||
            selectedComplaints.length < maxSelection! ||
            isSelected;

        return GestureDetector(
          onTap: canSelect ? () => onComplaintToggled(complaint) : null,
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            decoration: BoxDecoration(
              color: isSelected
                  ? AppColors.primaryBlue
                  : (canSelect ? AppColors.surfaceWhite : AppColors.cardGrey),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: isSelected
                    ? AppColors.primaryBlue
                    : (canSelect ? AppColors.primaryBlueLight : AppColors.cardGrey),
                width: 1.5,
              ),
            ),
            child: Text(
              '#$complaint',
              style: TextStyle(
                color: isSelected
                    ? Colors.white
                    : (canSelect ? AppColors.primaryBlue : AppColors.textHint),
                fontWeight: FontWeight.w500,
                fontSize: 13,
              ),
            ),
          ),
        );
      }).toList(),
    );
  }
}

class GradeSelector extends StatelessWidget {
  final List<String> grades;
  final String? selectedGrade;
  final Function(String) onGradeSelected;
  final bool compact;

  const GradeSelector({
    super.key,
    required this.grades,
    required this.selectedGrade,
    required this.onGradeSelected,
    this.compact = false,
  });

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: grades.map((grade) {
          final isSelected = grade == selectedGrade;
          return Padding(
            padding: const EdgeInsets.only(right: 6),
            child: GestureDetector(
              onTap: () => onGradeSelected(grade),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 150),
                constraints: BoxConstraints(
                  minWidth: compact ? 42 : 50,
                  minHeight: compact ? 38 : 44,
                ),
                padding: EdgeInsets.symmetric(
                  horizontal: compact ? 10 : 14,
                  vertical: compact ? 8 : 10,
                ),
                decoration: BoxDecoration(
                  color: isSelected ? AppColors.primaryBlue : AppColors.cardGrey,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Center(
                  child: Text(
                    grade,
                    style: TextStyle(
                      color: isSelected ? Colors.white : AppColors.textPrimary,
                      fontWeight: FontWeight.w600,
                      fontSize: compact ? 12 : 14,
                    ),
                  ),
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}
