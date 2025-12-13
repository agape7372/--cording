import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';
import '../../core/constants/app_constants.dart';
import '../../widgets/choice_chips/symptom_chips.dart';
import '../../widgets/common/arc_slider.dart';
import '../../widgets/body_map/body_map_widget.dart';

class SubjectiveScreen extends StatefulWidget {
  const SubjectiveScreen({super.key});

  @override
  State<SubjectiveScreen> createState() => _SubjectiveScreenState();
}

class _SubjectiveScreenState extends State<SubjectiveScreen> {
  // Patient Info
  int _age = 50;
  String? _gender;

  // Chief Complaints
  final Set<String> _selectedComplaints = {};

  // Pain
  final Map<String, int> _painLocations = {};
  double _currentVas = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundGrey,
      appBar: AppBar(
        title: const Text('Subjective'),
        actions: [
          TextButton.icon(
            onPressed: _clearAll,
            icon: const Icon(Icons.refresh, color: Colors.white70),
            label: const Text('Clear', style: TextStyle(color: Colors.white70)),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildPatientInfoCard(),
            const SizedBox(height: 16),
            _buildChiefComplaintsCard(),
            const SizedBox(height: 16),
            _buildPainAssessmentCard(),
          ],
        ),
      ),
    );
  }

  Widget _buildPatientInfoCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.person, color: AppColors.primaryBlue),
                const SizedBox(width: 8),
                Text(
                  'Patient Information',
                  style: Theme.of(context).textTheme.titleLarge,
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Age Picker
            Row(
              children: [
                const SizedBox(
                  width: 80,
                  child: Text(
                    'Age',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
                Expanded(
                  child: Container(
                    height: 56,
                    decoration: BoxDecoration(
                      color: AppColors.cardGrey,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      children: [
                        IconButton(
                          onPressed: () {
                            if (_age > 0) setState(() => _age--);
                          },
                          icon: const Icon(Icons.remove_circle),
                          color: AppColors.primaryBlue,
                          iconSize: 32,
                        ),
                        Expanded(
                          child: Center(
                            child: Text(
                              '$_age yrs',
                              style: const TextStyle(
                                fontSize: 22,
                                fontWeight: FontWeight.bold,
                                color: AppColors.primaryBlue,
                              ),
                            ),
                          ),
                        ),
                        IconButton(
                          onPressed: () {
                            if (_age < 120) setState(() => _age++);
                          },
                          icon: const Icon(Icons.add_circle),
                          color: AppColors.primaryBlue,
                          iconSize: 32,
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Gender Selector
            Row(
              children: [
                const SizedBox(
                  width: 80,
                  child: Text(
                    'Gender',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
                Expanded(
                  child: Row(
                    children: [
                      Expanded(
                        child: GestureDetector(
                          onTap: () => setState(() => _gender = 'M'),
                          child: Container(
                            height: 56,
                            decoration: BoxDecoration(
                              color: _gender == 'M'
                                  ? AppColors.primaryBlue
                                  : AppColors.cardGrey,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(
                                  Icons.male,
                                  color: _gender == 'M'
                                      ? Colors.white
                                      : AppColors.textSecondary,
                                  size: 28,
                                ),
                                const SizedBox(width: 8),
                                Text(
                                  'Male',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w600,
                                    color: _gender == 'M'
                                        ? Colors.white
                                        : AppColors.textPrimary,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: GestureDetector(
                          onTap: () => setState(() => _gender = 'F'),
                          child: Container(
                            height: 56,
                            decoration: BoxDecoration(
                              color: _gender == 'F'
                                  ? AppColors.primaryBlue
                                  : AppColors.cardGrey,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(
                                  Icons.female,
                                  color: _gender == 'F'
                                      ? Colors.white
                                      : AppColors.textSecondary,
                                  size: 28,
                                ),
                                const SizedBox(width: 8),
                                Text(
                                  'Female',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w600,
                                    color: _gender == 'F'
                                        ? Colors.white
                                        : AppColors.textPrimary,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildChiefComplaintsCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.medical_services, color: AppColors.primaryBlue),
                const SizedBox(width: 8),
                Text(
                  'Chief Complaints (C.C)',
                  style: Theme.of(context).textTheme.titleLarge,
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              'Select symptoms (tap to toggle)',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            const SizedBox(height: 16),
            ChiefComplaintChips(
              complaints: AppConstants.chiefComplaintTags,
              selectedComplaints: _selectedComplaints,
              onComplaintToggled: (complaint) {
                setState(() {
                  if (_selectedComplaints.contains(complaint)) {
                    _selectedComplaints.remove(complaint);
                  } else {
                    _selectedComplaints.add(complaint);
                  }
                });
              },
            ),
            if (_selectedComplaints.isNotEmpty) ...[
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.accentMint.withAlpha(30),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.accentMint),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.check_circle, color: AppColors.accentMint),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        '${_selectedComplaints.length} symptom(s) selected',
                        style: const TextStyle(
                          color: AppColors.accentMintDark,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildPainAssessmentCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.healing, color: AppColors.primaryBlue),
                const SizedBox(width: 8),
                Text(
                  'Pain Assessment (VAS)',
                  style: Theme.of(context).textTheme.titleLarge,
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              'Tap body part, then set pain level',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            const SizedBox(height: 20),

            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Body Map
                Expanded(
                  flex: 3,
                  child: Column(
                    children: [
                      BodyMapWidget(
                        selectedParts: _painLocations,
                        onPartSelected: (part) {
                          setState(() {
                            _currentVas = (_painLocations[part] ?? 0).toDouble();
                          });
                          _showVasBottomSheet(part);
                        },
                      ),
                    ],
                  ),
                ),

                const SizedBox(width: 16),

                // Pain List
                Expanded(
                  flex: 2,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Pain Locations',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 12),
                      if (_painLocations.isEmpty)
                        Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: AppColors.cardGrey,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Text(
                            'Tap on body to add pain location',
                            style: TextStyle(color: AppColors.textSecondary),
                          ),
                        )
                      else
                        ..._painLocations.entries.map((entry) {
                          return Container(
                            margin: const EdgeInsets.only(bottom: 8),
                            padding: const EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 10,
                            ),
                            decoration: BoxDecoration(
                              color: AppColors.surfaceWhite,
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(color: AppColors.cardGrey),
                            ),
                            child: Row(
                              children: [
                                Container(
                                  width: 8,
                                  height: 32,
                                  decoration: BoxDecoration(
                                    color: _getPainColor(entry.value),
                                    borderRadius: BorderRadius.circular(4),
                                  ),
                                ),
                                const SizedBox(width: 10),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        entry.key,
                                        style: const TextStyle(
                                          fontWeight: FontWeight.w500,
                                        ),
                                      ),
                                      Text(
                                        'VAS: ${entry.value}/10',
                                        style: TextStyle(
                                          fontSize: 12,
                                          color: _getPainColor(entry.value),
                                          fontWeight: FontWeight.w600,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                IconButton(
                                  onPressed: () {
                                    setState(() {
                                      _painLocations.remove(entry.key);
                                    });
                                  },
                                  icon: const Icon(Icons.close, size: 18),
                                  color: AppColors.textSecondary,
                                ),
                              ],
                            ),
                          );
                        }),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _showVasBottomSheet(String bodyPart) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Container(
              padding: const EdgeInsets.all(24),
              decoration: const BoxDecoration(
                color: AppColors.surfaceWhite,
                borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 40,
                    height: 4,
                    decoration: BoxDecoration(
                      color: AppColors.cardGrey,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                  const SizedBox(height: 20),
                  Text(
                    bodyPart,
                    style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Set Pain Level (VAS)',
                    style: TextStyle(
                      fontSize: 16,
                      color: AppColors.textSecondary,
                    ),
                  ),
                  const SizedBox(height: 24),
                  ArcSlider(
                    value: _currentVas,
                    min: 0,
                    max: 10,
                    size: 220,
                    gradientColors: const [
                      AppColors.painLow,
                      AppColors.painMedium,
                      AppColors.painHigh,
                    ],
                    onChanged: (value) {
                      setModalState(() {
                        _currentVas = value;
                      });
                    },
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'No Pain',
                        style: TextStyle(
                          color: AppColors.painLow,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      Text(
                        'Worst Pain',
                        style: TextStyle(
                          color: AppColors.painHigh,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () {
                            setState(() {
                              _painLocations.remove(bodyPart);
                            });
                            Navigator.pop(context);
                          },
                          child: const Text('Remove'),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: ElevatedButton(
                          onPressed: () {
                            setState(() {
                              _painLocations[bodyPart] = _currentVas.round();
                            });
                            Navigator.pop(context);
                          },
                          child: const Text('Save'),
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: MediaQuery.of(context).padding.bottom + 8),
                ],
              ),
            );
          },
        );
      },
    );
  }

  Color _getPainColor(int level) {
    if (level <= 3) {
      return Color.lerp(AppColors.painLow, AppColors.painMedium, level / 3)!;
    } else if (level <= 6) {
      return Color.lerp(
          AppColors.painMedium, AppColors.painHigh, (level - 3) / 3)!;
    } else {
      return AppColors.painHigh;
    }
  }

  void _clearAll() {
    setState(() {
      _age = 50;
      _gender = null;
      _selectedComplaints.clear();
      _painLocations.clear();
      _currentVas = 0;
    });
  }
}
