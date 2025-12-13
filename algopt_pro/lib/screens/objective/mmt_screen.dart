import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';
import '../../core/constants/app_constants.dart';
import '../../widgets/common/touch_button.dart';
import '../../widgets/choice_chips/symptom_chips.dart';

class MmtScreen extends StatefulWidget {
  const MmtScreen({super.key});

  @override
  State<MmtScreen> createState() => _MmtScreenState();
}

class _MmtScreenState extends State<MmtScreen> {
  final Map<String, String> _mmtScoresRight = {};
  final Map<String, String> _mmtScoresLeft = {};
  bool _isRightSide = true;

  Map<String, String> get _currentScores =>
      _isRightSide ? _mmtScoresRight : _mmtScoresLeft;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Quick Actions
        Container(
          color: AppColors.surfaceWhite,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Row(
            children: [
              Expanded(
                child: QuickActionButton(
                  label: 'All Normal',
                  icon: Icons.check_circle,
                  onPressed: _setAllNormal,
                  color: AppColors.accentMint,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: QuickActionButton(
                  label: 'Clear All',
                  icon: Icons.clear_all,
                  onPressed: _clearAll,
                  color: AppColors.textSecondary,
                ),
              ),
            ],
          ),
        ),

        // Side Selector
        Container(
          color: AppColors.surfaceWhite,
          padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
          child: Row(
            children: [
              const Text(
                'Side:',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Row(
                  children: [
                    Expanded(
                      child: TouchButton(
                        label: 'Right',
                        isSelected: _isRightSide,
                        onPressed: () => setState(() => _isRightSide = true),
                        icon: Icons.arrow_back,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: TouchButton(
                        label: 'Left',
                        isSelected: !_isRightSide,
                        onPressed: () => setState(() => _isRightSide = false),
                        icon: Icons.arrow_forward,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),

        // MMT List
        Expanded(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: AppConstants.muscleGroups.map((muscle) {
                final selectedGrade = _currentScores[muscle];

                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: Text(
                                muscle,
                                style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                            if (selectedGrade != null)
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 12,
                                  vertical: 4,
                                ),
                                decoration: BoxDecoration(
                                  color: _getGradeColor(selectedGrade),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Text(
                                  selectedGrade,
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.w600,
                                    fontSize: 13,
                                  ),
                                ),
                              ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        GradeSelector(
                          grades: AppConstants.mmtGrades,
                          selectedGrade: selectedGrade,
                          onGradeSelected: (grade) {
                            setState(() {
                              if (_isRightSide) {
                                _mmtScoresRight[muscle] = grade;
                              } else {
                                _mmtScoresLeft[muscle] = grade;
                              }
                            });
                          },
                          compact: true,
                        ),
                      ],
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
        ),
      ],
    );
  }

  Color _getGradeColor(String grade) {
    final value = AppConstants.mmtGradeValues[grade] ?? 0;
    if (value >= 4) return AppColors.accentMint;
    if (value >= 3) return AppColors.warning;
    return AppColors.error;
  }

  void _setAllNormal() {
    setState(() {
      for (var muscle in AppConstants.muscleGroups) {
        if (_isRightSide) {
          _mmtScoresRight[muscle] = 'Normal';
        } else {
          _mmtScoresLeft[muscle] = 'Normal';
        }
      }
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          '${_isRightSide ? "Right" : "Left"} side set to Normal',
        ),
        backgroundColor: AppColors.accentMint,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        duration: const Duration(seconds: 2),
      ),
    );
  }

  void _clearAll() {
    setState(() {
      if (_isRightSide) {
        _mmtScoresRight.clear();
      } else {
        _mmtScoresLeft.clear();
      }
    });
  }
}
