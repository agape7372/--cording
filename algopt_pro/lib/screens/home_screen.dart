import 'package:flutter/material.dart';
import '../core/theme/app_theme.dart';
import '../core/constants/app_constants.dart';
import 'subjective/subjective_screen.dart';
import 'objective/objective_screen.dart';
import 'cdss/cdss_screen.dart';
import 'tools/clinical_stopwatch_screen.dart';
import 'tools/pro_metronome_screen.dart';
import 'tools/cadence_calculator_screen.dart';
import 'tools/dual_task_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedIndex = 0;

  void updateSelectedIndex(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  final List<Widget> _screens = const [
    _DashboardScreen(),
    SubjectiveScreen(),
    ObjectiveScreen(),
    CdssScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_selectedIndex],
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          boxShadow: [
            BoxShadow(
              color: Colors.black.withAlpha(15),
              blurRadius: 10,
              offset: const Offset(0, -2),
            ),
          ],
        ),
        child: NavigationBar(
          selectedIndex: _selectedIndex,
          onDestinationSelected: (index) {
            setState(() {
              _selectedIndex = index;
            });
          },
          backgroundColor: AppColors.surfaceWhite,
          indicatorColor: AppColors.primaryBlue.withAlpha(40),
          height: 75,
          labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
          destinations: const [
            NavigationDestination(
              icon: Icon(Icons.home_outlined),
              selectedIcon: Icon(Icons.home, color: AppColors.primaryBlue),
              label: 'Home',
            ),
            NavigationDestination(
              icon: Icon(Icons.person_outline),
              selectedIcon: Icon(Icons.person, color: AppColors.primaryBlue),
              label: 'Subjective',
            ),
            NavigationDestination(
              icon: Icon(Icons.assessment_outlined),
              selectedIcon: Icon(Icons.assessment, color: AppColors.primaryBlue),
              label: 'Objective',
            ),
            NavigationDestination(
              icon: Icon(Icons.psychology_outlined),
              selectedIcon: Icon(Icons.psychology, color: AppColors.primaryBlue),
              label: 'AI Support',
            ),
          ],
        ),
      ),
    );
  }
}

class _DashboardScreen extends StatelessWidget {
  const _DashboardScreen();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundGrey,
      body: CustomScrollView(
        slivers: [
          // App Bar
          SliverAppBar(
            expandedHeight: 140,
            pinned: true,
            backgroundColor: AppColors.primaryBlue,
            flexibleSpace: FlexibleSpaceBar(
              titlePadding: const EdgeInsets.only(left: 20, bottom: 16),
              title: Column(
                mainAxisAlignment: MainAxisAlignment.end,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    AppConstants.appName,
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const Text(
                    'AI Clinical Partner',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w400,
                      color: Colors.white70,
                    ),
                  ),
                ],
              ),
              background: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      AppColors.primaryBlueDark,
                      AppColors.primaryBlue,
                    ],
                  ),
                ),
                child: const Align(
                  alignment: Alignment.centerRight,
                  child: Padding(
                    padding: EdgeInsets.only(right: 20),
                    child: Icon(
                      Icons.medical_services,
                      size: 80,
                      color: Colors.white12,
                    ),
                  ),
                ),
              ),
            ),
          ),

          // Content
          SliverPadding(
            padding: const EdgeInsets.all(16),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                _buildQuickActionsCard(context),
                const SizedBox(height: 16),
                _buildClinicalToolsCard(context),
                const SizedBox(height: 16),
                _buildWorkflowCard(context),
                const SizedBox(height: 16),
                _buildTipsCard(context),
              ]),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActionsCard(BuildContext context) {
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
                  'Quick Start',
                  style: Theme.of(context).textTheme.titleLarge,
                ),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: _QuickActionTile(
                    icon: Icons.add_circle,
                    label: 'New\nAssessment',
                    color: AppColors.primaryBlue,
                    onTap: () => _navigateToTab(context, 1),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _QuickActionTile(
                    icon: Icons.search,
                    label: 'AI\nSearch',
                    color: AppColors.accentMint,
                    onTap: () => _navigateToTab(context, 3),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _QuickActionTile(
                    icon: Icons.accessibility_new,
                    label: 'ROM\nTest',
                    color: AppColors.warning,
                    onTap: () => _navigateToTab(context, 2),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildClinicalToolsCard(BuildContext context) {
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
                  'Clinical Tools',
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                const Spacer(),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.accentMint.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Text(
                    'PNF 정량화',
                    style: TextStyle(
                      color: AppColors.accentMint,
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: 3,
              mainAxisSpacing: 12,
              crossAxisSpacing: 12,
              childAspectRatio: 0.9,
              children: [
                _ClinicalToolTile(
                  icon: Icons.timer,
                  label: '보행 검사',
                  subtitle: '10MWT/TUG',
                  color: AppColors.primaryBlue,
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const ClinicalStopwatchScreen()),
                  ),
                ),
                _ClinicalToolTile(
                  icon: Icons.music_note,
                  label: '메트로놈',
                  subtitle: 'Auditory Cue',
                  color: const Color(0xFF8B5CF6),
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const ProMetronomeScreen()),
                  ),
                ),
                _ClinicalToolTile(
                  icon: Icons.directions_walk,
                  label: '보행수',
                  subtitle: 'Cadence',
                  color: AppColors.success,
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const CadenceCalculatorScreen()),
                  ),
                ),
                _ClinicalToolTile(
                  icon: Icons.psychology,
                  label: '이중 과제',
                  subtitle: 'Dual Task',
                  color: AppColors.warning,
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const DualTaskScreen()),
                  ),
                ),
                _ClinicalToolTile(
                  icon: Icons.straighten,
                  label: '고니오미터',
                  subtitle: 'ROM 측정',
                  color: const Color(0xFFEC4899),
                  onTap: null,
                  comingSoon: true,
                ),
                _ClinicalToolTile(
                  icon: Icons.balance,
                  label: '수평계',
                  subtitle: '자세 분석',
                  color: const Color(0xFF06B6D4),
                  onTap: null,
                  comingSoon: true,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildWorkflowCard(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.route, color: AppColors.primaryBlue),
                const SizedBox(width: 8),
                Text(
                  'Assessment Workflow',
                  style: Theme.of(context).textTheme.titleLarge,
                ),
              ],
            ),
            const SizedBox(height: 20),
            _buildWorkflowStep(
              number: '1',
              title: 'Subjective',
              description: 'Patient info, C.C, Pain (VAS)',
              isActive: true,
            ),
            _buildWorkflowConnector(),
            _buildWorkflowStep(
              number: '2',
              title: 'Objective',
              description: 'MAS, MMT, ROM assessment',
              isActive: false,
            ),
            _buildWorkflowConnector(),
            _buildWorkflowStep(
              number: '3',
              title: 'Assessment',
              description: 'AI-powered clinical reasoning',
              isActive: false,
            ),
            _buildWorkflowConnector(),
            _buildWorkflowStep(
              number: '4',
              title: 'Plan',
              description: 'Generate SOAP note for EMR',
              isActive: false,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildWorkflowStep({
    required String number,
    required String title,
    required String description,
    required bool isActive,
  }) {
    return Row(
      children: [
        Container(
          width: 36,
          height: 36,
          decoration: BoxDecoration(
            color: isActive ? AppColors.primaryBlue : AppColors.cardGrey,
            shape: BoxShape.circle,
          ),
          child: Center(
            child: Text(
              number,
              style: TextStyle(
                color: isActive ? Colors.white : AppColors.textSecondary,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: isActive
                      ? AppColors.primaryBlue
                      : AppColors.textPrimary,
                ),
              ),
              Text(
                description,
                style: const TextStyle(
                  fontSize: 13,
                  color: AppColors.textSecondary,
                ),
              ),
            ],
          ),
        ),
        if (isActive)
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: AppColors.accentMint.withAlpha(40),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Text(
              'Start',
              style: TextStyle(
                color: AppColors.accentMint,
                fontWeight: FontWeight.w600,
                fontSize: 12,
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildWorkflowConnector() {
    return Container(
      margin: const EdgeInsets.only(left: 17),
      width: 2,
      height: 24,
      color: AppColors.cardGrey,
    );
  }

  Widget _buildTipsCard(BuildContext context) {
    return Card(
      color: AppColors.primaryBlue.withAlpha(15),
      elevation: 0,
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.lightbulb, color: AppColors.warning),
                const SizedBox(width: 8),
                Text(
                  'Pro Tips',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        color: AppColors.primaryBlueDark,
                      ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            const _TipItem(
              text: 'Use [All Normal] button for quick MMT entry',
            ),
            const _TipItem(
              text: 'Tap body map to set pain locations with VAS',
            ),
            const _TipItem(
              text: 'ROM slider shows real-time mannequin movement',
            ),
            const _TipItem(
              text: 'Copy SOAP notes directly to your EMR',
            ),
          ],
        ),
      ),
    );
  }

  void _navigateToTab(BuildContext context, int index) {
    final homeState = context.findAncestorStateOfType<_HomeScreenState>();
    homeState?.updateSelectedIndex(index);
  }
}

class _QuickActionTile extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _QuickActionTile({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: color.withAlpha(25),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: color.withAlpha(50)),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 32),
            const SizedBox(height: 8),
            Text(
              label,
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: color,
                height: 1.2,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _TipItem extends StatelessWidget {
  final String text;

  const _TipItem({required this.text});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(
            Icons.check_circle,
            size: 16,
            color: AppColors.accentMint,
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(
                fontSize: 13,
                color: AppColors.textPrimary,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _ClinicalToolTile extends StatelessWidget {
  final IconData icon;
  final String label;
  final String subtitle;
  final Color color;
  final VoidCallback? onTap;
  final bool comingSoon;

  const _ClinicalToolTile({
    required this.icon,
    required this.label,
    required this.subtitle,
    required this.color,
    this.onTap,
    this.comingSoon = false,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: comingSoon ? null : onTap,
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: color.withAlpha(20),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: color.withAlpha(40)),
        ),
        child: Stack(
          children: [
            Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(icon, color: color, size: 28),
                const SizedBox(height: 8),
                Text(
                  label,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: color,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 10,
                    color: color.withAlpha(180),
                  ),
                ),
              ],
            ),
            if (comingSoon)
              Positioned(
                top: 0,
                right: 0,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                  decoration: BoxDecoration(
                    color: AppColors.textSecondary.withAlpha(40),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: const Text(
                    'Soon',
                    style: TextStyle(
                      fontSize: 8,
                      color: AppColors.textSecondary,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
