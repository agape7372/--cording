import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../core/theme/app_theme.dart';

class CdssScreen extends StatefulWidget {
  const CdssScreen({super.key});

  @override
  State<CdssScreen> createState() => _CdssScreenState();
}

class _CdssScreenState extends State<CdssScreen> {
  bool _isLoading = false;
  String? _searchResult;
  String? _soapNote;

  final List<String> _recentConditions = [
    'Stroke - Hemiplegia',
    'Parkinson\'s Disease',
    'Spinal Cord Injury',
    'Traumatic Brain Injury',
    'Multiple Sclerosis',
    'Cerebral Palsy',
    'Guillain-Barré Syndrome',
    'Peripheral Neuropathy',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundGrey,
      appBar: AppBar(
        title: const Text('AI Clinical Support'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildSearchCard(),
            const SizedBox(height: 16),
            _buildQuickConditionsCard(),
            if (_isLoading) ...[
              const SizedBox(height: 24),
              _buildLoadingIndicator(),
            ],
            if (_searchResult != null) ...[
              const SizedBox(height: 16),
              _buildResultCard(),
            ],
            if (_soapNote != null) ...[
              const SizedBox(height: 16),
              _buildSoapNoteCard(),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildSearchCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: AppColors.primaryBlue.withAlpha(30),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(
                    Icons.psychology,
                    color: AppColors.primaryBlue,
                    size: 28,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Evidence-Based Search',
                        style: Theme.of(context).textTheme.titleLarge,
                      ),
                      const Text(
                        'Find clinical guidelines & interventions',
                        style: TextStyle(
                          color: AppColors.textSecondary,
                          fontSize: 13,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            ElevatedButton.icon(
              onPressed: () => _performSearch('Current patient condition'),
              icon: const Icon(Icons.search),
              label: const Text('Search Interventions for This Case'),
              style: ElevatedButton.styleFrom(
                minimumSize: const Size(double.infinity, 56),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickConditionsCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.flash_on, color: AppColors.accentMint),
                const SizedBox(width: 8),
                Text(
                  'Quick Search by Condition',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
              ],
            ),
            const SizedBox(height: 16),
            Wrap(
              spacing: 10,
              runSpacing: 10,
              children: _recentConditions.map((condition) {
                return GestureDetector(
                  onTap: () => _performSearch(condition),
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 12,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.surfaceWhite,
                      borderRadius: BorderRadius.circular(25),
                      border: Border.all(color: AppColors.cardGrey, width: 1.5),
                    ),
                    child: Text(
                      condition,
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLoadingIndicator() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          children: [
            const CircularProgressIndicator(
              color: AppColors.primaryBlue,
              strokeWidth: 3,
            ),
            const SizedBox(height: 20),
            Text(
              '임상 데이터를 분석 중입니다...',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    color: AppColors.primaryBlue,
                  ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Searching clinical guidelines and systematic reviews',
              style: TextStyle(
                color: AppColors.textSecondary,
                fontSize: 13,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildResultCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.article, color: AppColors.primaryBlue),
                const SizedBox(width: 8),
                Text(
                  'Clinical Recommendations',
                  style: Theme.of(context).textTheme.titleLarge,
                ),
              ],
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.backgroundGrey,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                _searchResult!,
                style: const TextStyle(
                  fontSize: 14,
                  height: 1.6,
                ),
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: _generateSoapNote,
                    icon: const Icon(Icons.description),
                    label: const Text('Generate SOAP Note'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSoapNoteCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    const Icon(Icons.note_alt, color: AppColors.accentMint),
                    const SizedBox(width: 8),
                    Text(
                      'SOAP Note',
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                  ],
                ),
                ElevatedButton.icon(
                  onPressed: () => _copyToClipboard(_soapNote!),
                  icon: const Icon(Icons.copy, size: 18),
                  label: const Text('Copy for EMR'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.accentMint,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.surfaceWhite,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.cardGrey),
              ),
              child: SelectableText(
                _soapNote!,
                style: const TextStyle(
                  fontSize: 13,
                  height: 1.8,
                  fontFamily: 'monospace',
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _performSearch(String condition) async {
    setState(() {
      _isLoading = true;
      _searchResult = null;
      _soapNote = null;
    });

    // Simulate API call delay
    await Future.delayed(const Duration(seconds: 2));

    setState(() {
      _isLoading = false;
      _searchResult = '''
**Condition: $condition**

**1. Evidence-Based Interventions (Grade A-B)**
• Task-oriented training: High-intensity, repetitive task practice (Evidence: Strong)
• Constraint-induced movement therapy (CIMT): For upper extremity hemiparesis
• Body weight-supported treadmill training: Recommended for gait rehabilitation
• Neurodevelopmental treatment (NDT/Bobath): For motor control and postural alignment

**2. Recommended Assessment Tools**
• Berg Balance Scale (BBS): Fall risk assessment
• Functional Independence Measure (FIM): ADL evaluation
• Modified Ashworth Scale (MAS): Spasticity grading
• 10-Meter Walk Test: Gait velocity assessment

**3. Treatment Frequency Guidelines**
• Acute phase: 1-2 sessions/day, 5-7 days/week
• Subacute phase: 1 session/day, 5 days/week
• Chronic phase: 2-3 sessions/week, maintenance

**4. Key Precautions**
• Monitor vital signs during activity
• Assess for orthostatic hypotension
• Joint protection during passive ROM
• Skin integrity checks for sensory impairment

**References:**
- Clinical Practice Guidelines for Stroke Rehabilitation (2023)
- Cochrane Systematic Review: Physical Therapy Interventions
''';
    });
  }

  void _generateSoapNote() {
    setState(() {
      _soapNote = '''
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SOAP NOTE - Physical Therapy
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[S] Subjective:
   • C.C: Gait disturbance, Balance deficit
   • Pain: VAS 4/10 (R.Shoulder)
   • Pt. reports difficulty with ambulation
   • Decreased independence in ADL

[O] Objective:
   • MAS: R.Elbow Flexors G1+, R.Wrist Flexors G1
   • MMT: R.UE - Fair to Good, R.LE - Poor+ to Fair
   • ROM: R.Shoulder Flexion 120°, limited
   • Berg Balance Scale: 32/56 (fall risk)
   • 10MWT: 0.6 m/s (community ambulation limited)

[A] Assessment:
   • Hemiparetic gait pattern with reduced weight shift
   • Moderate spasticity affecting UE function
   • Balance impairment - moderate fall risk
   • Functional mobility: moderate assist required

[P] Plan:
   • Task-oriented gait training 30 min
   • Mat exercises for core stability
   • UE functional training with reaching tasks
   • Balance training (static→dynamic progression)
   • Caregiver education for home exercise program
   • Frequency: 5x/week, 45-60 min sessions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
''';
    });
  }

  void _copyToClipboard(String text) {
    Clipboard.setData(ClipboardData(text: text));
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Row(
          children: [
            Icon(Icons.check_circle, color: Colors.white),
            SizedBox(width: 8),
            Text('Copied to clipboard! Paste in EMR.'),
          ],
        ),
        backgroundColor: AppColors.accentMint,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        duration: const Duration(seconds: 2),
      ),
    );
  }
}
