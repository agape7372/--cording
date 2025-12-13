import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';
import '../../core/constants/app_constants.dart';
import '../../widgets/common/touch_button.dart';
import '../../widgets/rom_mannequin/rom_mannequin_viewer.dart';

class RomScreen extends StatefulWidget {
  const RomScreen({super.key});

  @override
  State<RomScreen> createState() => _RomScreenState();
}

class _RomScreenState extends State<RomScreen> {
  final Map<String, int> _romScoresRight = {};
  final Map<String, int> _romScoresLeft = {};
  final Map<String, bool> _romWnlRight = {};
  final Map<String, bool> _romWnlLeft = {};

  bool _isRightSide = true;
  String _selectedMovement = 'Shoulder Flexion';

  Map<String, int> get _currentScores =>
      _isRightSide ? _romScoresRight : _romScoresLeft;

  Map<String, bool> get _currentWnl =>
      _isRightSide ? _romWnlRight : _romWnlLeft;

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
                  label: 'All WNL',
                  icon: Icons.check_circle,
                  onPressed: _setAllWnl,
                  color: AppColors.accentMint,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: TouchButton(
                  label: _isRightSide ? 'Right Side' : 'Left Side',
                  isSelected: true,
                  icon: _isRightSide ? Icons.arrow_back : Icons.arrow_forward,
                  onPressed: () {
                    setState(() {
                      _isRightSide = !_isRightSide;
                    });
                  },
                ),
              ),
            ],
          ),
        ),

        // Movement Selector
        Container(
          height: 56,
          color: AppColors.cardGrey,
          child: ListView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            children: AppConstants.romNormalRanges.keys.map((movement) {
              final isSelected = movement == _selectedMovement;
              final isWnl = _currentWnl[movement] ?? false;
              final hasValue = _currentScores.containsKey(movement);

              return Padding(
                padding: const EdgeInsets.only(right: 8),
                child: GestureDetector(
                  onTap: () => setState(() => _selectedMovement = movement),
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 14,
                      vertical: 8,
                    ),
                    decoration: BoxDecoration(
                      color: isSelected
                          ? AppColors.primaryBlue
                          : (isWnl || hasValue)
                              ? AppColors.accentMint.withAlpha(50)
                              : AppColors.surfaceWhite,
                      borderRadius: BorderRadius.circular(20),
                      border: isWnl || hasValue
                          ? Border.all(color: AppColors.accentMint, width: 2)
                          : null,
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        if (isWnl || hasValue) ...[
                          Icon(
                            Icons.check,
                            size: 14,
                            color: isSelected
                                ? Colors.white
                                : AppColors.accentMint,
                          ),
                          const SizedBox(width: 4),
                        ],
                        Text(
                          _getShortName(movement),
                          style: TextStyle(
                            color: isSelected
                                ? Colors.white
                                : AppColors.textPrimary,
                            fontWeight: FontWeight.w500,
                            fontSize: 13,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
        ),

        // ROM Assessment with Mannequin
        Expanded(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                _buildRomCard(),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildRomCard() {
    final normalRange = AppConstants.romNormalRanges[_selectedMovement]!;
    final isWnl = _currentWnl[_selectedMovement] ?? false;
    final currentValue = _currentScores[_selectedMovement] ?? normalRange['max']!;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // Movement Title
            Text(
              _selectedMovement,
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 8),
            Text(
              'Normal Range: ${normalRange['min']}° - ${normalRange['max']}°',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            const SizedBox(height: 16),

            // WNL Button
            GestureDetector(
              onTap: () {
                setState(() {
                  if (_isRightSide) {
                    _romWnlRight[_selectedMovement] = !isWnl;
                    if (!isWnl) {
                      _romScoresRight.remove(_selectedMovement);
                    }
                  } else {
                    _romWnlLeft[_selectedMovement] = !isWnl;
                    if (!isWnl) {
                      _romScoresLeft.remove(_selectedMovement);
                    }
                  }
                });
              },
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 24,
                  vertical: 14,
                ),
                decoration: BoxDecoration(
                  color: isWnl ? AppColors.accentMint : AppColors.cardGrey,
                  borderRadius: BorderRadius.circular(30),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      isWnl ? Icons.check_circle : Icons.circle_outlined,
                      color: isWnl ? Colors.white : AppColors.textSecondary,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'WNL (Within Normal Limits)',
                      style: TextStyle(
                        color: isWnl ? Colors.white : AppColors.textPrimary,
                        fontWeight: FontWeight.w600,
                        fontSize: 16,
                      ),
                    ),
                  ],
                ),
              ),
            ),

            if (!isWnl) ...[
              const SizedBox(height: 24),
              const Divider(),
              const SizedBox(height: 16),

              // Interactive ROM Viewer
              InteractiveRomViewer(
                movement: _selectedMovement,
                initialAngle: currentValue.toDouble(),
                minAngle: normalRange['min']!.toDouble(),
                maxAngle: normalRange['max']!.toDouble(),
                isRightSide: _isRightSide,
                onAngleChanged: (angle) {
                  setState(() {
                    if (_isRightSide) {
                      _romScoresRight[_selectedMovement] = angle.round();
                    } else {
                      _romScoresLeft[_selectedMovement] = angle.round();
                    }
                  });
                },
              ),
            ],
          ],
        ),
      ),
    );
  }

  String _getShortName(String movement) {
    return movement
        .replaceAll('Shoulder ', 'Sh.')
        .replaceAll('Elbow ', 'Elb.')
        .replaceAll('Forearm ', 'FA.')
        .replaceAll('Wrist ', 'Wr.')
        .replaceAll('Hip ', 'Hip.')
        .replaceAll('Knee ', 'Kn.')
        .replaceAll('Ankle ', 'Ank.')
        .replaceAll('Flexion', 'Flex')
        .replaceAll('Extension', 'Ext')
        .replaceAll('Abduction', 'Abd')
        .replaceAll('Adduction', 'Add')
        .replaceAll('Internal Rotation', 'IR')
        .replaceAll('External Rotation', 'ER')
        .replaceAll('Supination', 'Sup')
        .replaceAll('Pronation', 'Pro')
        .replaceAll('Dorsiflexion', 'DF')
        .replaceAll('Plantarflexion', 'PF');
  }

  void _setAllWnl() {
    setState(() {
      for (var movement in AppConstants.romNormalRanges.keys) {
        if (_isRightSide) {
          _romWnlRight[movement] = true;
          _romScoresRight.remove(movement);
        } else {
          _romWnlLeft[movement] = true;
          _romScoresLeft.remove(movement);
        }
      }
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          '${_isRightSide ? "Right" : "Left"} side set to WNL',
        ),
        backgroundColor: AppColors.accentMint,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        duration: const Duration(seconds: 2),
      ),
    );
  }
}
