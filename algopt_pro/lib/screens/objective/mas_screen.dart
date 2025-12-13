import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';
import '../../core/constants/app_constants.dart';
import '../../widgets/common/touch_button.dart';

class MasScreen extends StatefulWidget {
  const MasScreen({super.key});

  @override
  State<MasScreen> createState() => _MasScreenState();
}

class _MasScreenState extends State<MasScreen> {
  final Map<String, String> _masScores = {};
  bool _isRightSide = true;

  final List<String> _masBodyParts = [
    'Shoulder Flexors',
    'Shoulder Extensors',
    'Elbow Flexors',
    'Elbow Extensors',
    'Wrist Flexors',
    'Wrist Extensors',
    'Finger Flexors',
    'Hip Flexors',
    'Hip Extensors',
    'Hip Adductors',
    'Knee Flexors',
    'Knee Extensors',
    'Ankle Plantarflexors',
    'Ankle Dorsiflexors',
  ];

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildSideSelector(),
          const SizedBox(height: 16),
          _buildInfoCard(),
          const SizedBox(height: 16),
          _buildMasList(),
        ],
      ),
    );
  }

  Widget _buildSideSelector() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
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
    );
  }

  Widget _buildInfoCard() {
    return Card(
      color: AppColors.primaryBlue.withAlpha(25),
      elevation: 0,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.info_outline, color: AppColors.primaryBlue),
                const SizedBox(width: 8),
                Text(
                  'Modified Ashworth Scale (MAS)',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        color: AppColors.primaryBlue,
                        fontWeight: FontWeight.w600,
                      ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            const Wrap(
              spacing: 8,
              runSpacing: 6,
              children: [
                _GradeBadge('G0', 'No increase'),
                _GradeBadge('G1', 'Slight increase'),
                _GradeBadge('G1+', 'Catch + resistance'),
                _GradeBadge('G2', 'Marked increase'),
                _GradeBadge('G3', 'Considerable'),
                _GradeBadge('G4', 'Rigid'),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMasList() {
    return Column(
      children: _masBodyParts.map((part) {
        final key = '${_isRightSide ? 'R' : 'L'}_$part';
        final selectedGrade = _masScores[key];

        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  part,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 12),
                SegmentedButtonBar(
                  options: AppConstants.masGrades,
                  selectedOption: selectedGrade,
                  onSelected: (grade) {
                    setState(() {
                      _masScores[key] = grade;
                    });
                  },
                  isCompact: true,
                ),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }
}

class _GradeBadge extends StatelessWidget {
  final String grade;
  final String description;

  const _GradeBadge(this.grade, this.description);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: AppColors.surfaceWhite,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.primaryBlue.withAlpha(50)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            grade,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: AppColors.primaryBlue,
            ),
          ),
          const SizedBox(width: 4),
          Text(
            description,
            style: const TextStyle(
              fontSize: 11,
              color: AppColors.textSecondary,
            ),
          ),
        ],
      ),
    );
  }
}
