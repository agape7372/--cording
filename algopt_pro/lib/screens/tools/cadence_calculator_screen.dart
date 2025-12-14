import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../core/theme/app_theme.dart';

class CadenceCalculatorScreen extends StatefulWidget {
  const CadenceCalculatorScreen({super.key});

  @override
  State<CadenceCalculatorScreen> createState() => _CadenceCalculatorScreenState();
}

class _CadenceCalculatorScreenState extends State<CadenceCalculatorScreen> {
  bool _isActive = false;
  int _tapCount = 0;
  int _currentSPM = 0;
  int _avgSPM = 0;
  int _elapsedMs = 0;
  Timer? _timer;
  List<int> _tapTimes = [];
  List<Map<String, dynamic>> _history = [];

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _startSession() {
    setState(() {
      _isActive = true;
      _tapCount = 0;
      _currentSPM = 0;
      _avgSPM = 0;
      _elapsedMs = 0;
      _tapTimes = [];
    });

    _timer = Timer.periodic(const Duration(milliseconds: 100), (timer) {
      setState(() {
        _elapsedMs += 100;
        _avgSPM = _calculateAvgSPM();
      });
    });
  }

  void _stopSession() {
    _timer?.cancel();
    setState(() {
      _isActive = false;
    });

    if (_tapCount > 0 && _avgSPM > 0) {
      _history.insert(0, {
        'spm': _avgSPM,
        'steps': _tapCount,
        'duration': _elapsedMs / 1000,
        'timestamp': DateTime.now().toIso8601String(),
      });
      if (_history.length > 10) _history.removeLast();
    }
  }

  void _handleTap() {
    if (!_isActive) {
      _startSession();
    }

    final now = DateTime.now().millisecondsSinceEpoch;
    _tapTimes.add(now);

    setState(() {
      _tapCount++;
      _currentSPM = _calculateRealtimeSPM();
    });

    HapticFeedback.mediumImpact();
  }

  int _calculateRealtimeSPM() {
    if (_tapTimes.length < 2) return 0;

    // Use last 6 taps for rolling average
    final recentTaps = _tapTimes.length > 6
        ? _tapTimes.sublist(_tapTimes.length - 6)
        : _tapTimes;

    if (recentTaps.length < 2) return 0;

    final intervals = <int>[];
    for (int i = 1; i < recentTaps.length; i++) {
      intervals.add(recentTaps[i] - recentTaps[i - 1]);
    }

    final avgInterval = intervals.reduce((a, b) => a + b) / intervals.length;
    return (60000 / avgInterval).round();
  }

  int _calculateAvgSPM() {
    if (_tapCount < 1 || _elapsedMs < 1000) return 0;
    return ((_tapCount / (_elapsedMs / 1000)) * 60).round();
  }

  Map<String, dynamic>? _interpretSPM(int spm) {
    if (spm == 0) return null;
    if (spm >= 100 && spm <= 130) {
      return {'text': '정상 범위', 'color': AppColors.success};
    } else if (spm >= 80 && spm < 100) {
      return {'text': '느린 보행', 'color': AppColors.warning};
    } else if (spm < 80) {
      return {'text': '매우 느린 보행', 'color': AppColors.error};
    } else if (spm > 130) {
      return {'text': '빠른 보행', 'color': AppColors.primaryBlue};
    }
    return null;
  }

  String _formatTime(int ms) {
    final seconds = ms ~/ 1000;
    final minutes = seconds ~/ 60;
    final secs = seconds % 60;
    return '$minutes:${secs.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    final interpretation = _interpretSPM(_avgSPM);

    return Scaffold(
      backgroundColor: const Color(0xFF064E3B),
      appBar: AppBar(
        backgroundColor: const Color(0xFF064E3B),
        foregroundColor: Colors.white,
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Cadence Calculator', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            Text('보행수 측정 (SPM)', style: TextStyle(fontSize: 12, color: Colors.white70)),
          ],
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Main Display
            Expanded(
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text(
                      '실시간 Cadence',
                      style: TextStyle(color: Colors.white70, fontSize: 14),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      _currentSPM > 0 ? '$_currentSPM' : '—',
                      style: const TextStyle(
                        fontSize: 80,
                        fontWeight: FontWeight.w200,
                        color: Colors.white,
                        fontFamily: 'monospace',
                      ),
                    ),
                    const Text(
                      'SPM',
                      style: TextStyle(color: Colors.white70, fontSize: 20),
                    ),

                    const SizedBox(height: 32),

                    // Stats Row
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 32),
                      child: Row(
                        children: [
                          _buildStatCard('평균 SPM', _avgSPM > 0 ? '$_avgSPM' : '—'),
                          const SizedBox(width: 12),
                          _buildStatCard('걸음 수', '$_tapCount'),
                          const SizedBox(width: 12),
                          _buildStatCard('시간', _formatTime(_elapsedMs)),
                        ],
                      ),
                    ),

                    const SizedBox(height: 24),

                    // Interpretation
                    if (interpretation != null)
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                        decoration: BoxDecoration(
                          color: (interpretation['color'] as Color).withOpacity(0.3),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          interpretation['text'],
                          style: TextStyle(
                            color: interpretation['color'],
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ),

            // Tap Button
            Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  GestureDetector(
                    onTap: _handleTap,
                    child: Container(
                      width: 160,
                      height: 160,
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: _isActive
                              ? [AppColors.success, const Color(0xFF059669)]
                              : [AppColors.primaryBlue, const Color(0xFF2563EB)],
                        ),
                        shape: BoxShape.circle,
                        border: Border.all(color: Colors.white30, width: 4),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.3),
                            blurRadius: 30,
                            offset: const Offset(0, 10),
                          ),
                        ],
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Text('👣', style: TextStyle(fontSize: 48)),
                          const SizedBox(height: 8),
                          Text(
                            _isActive ? 'TAP' : 'START',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  if (_isActive) ...[
                    const SizedBox(height: 16),
                    OutlinedButton.icon(
                      onPressed: _stopSession,
                      icon: const Icon(Icons.stop, color: Colors.white),
                      label: const Text('측정 완료', style: TextStyle(color: Colors.white)),
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: Colors.white30, width: 2),
                        padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12),
                      ),
                    ),
                  ],
                ],
              ),
            ),

            // Guide
            Container(
              margin: const EdgeInsets.fromLTRB(16, 0, 16, 16),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.05),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('📋 측정 방법', style: TextStyle(color: Colors.white70, fontSize: 12)),
                  const SizedBox(height: 8),
                  const Text(
                    '환자가 걸을 때마다 버튼을 탭하세요.\n최근 5번의 탭 간격을 평균 내어 실시간 SPM을 계산합니다.',
                    style: TextStyle(color: Colors.white, fontSize: 13, height: 1.5),
                  ),
                  const Divider(color: Colors.white24, height: 24),
                  Row(
                    children: [
                      _buildRangeLabel('정상', '100-130', AppColors.success),
                      _buildRangeLabel('빠름', '>130', AppColors.primaryBlue),
                      _buildRangeLabel('느림', '80-100', AppColors.warning),
                      _buildRangeLabel('매우느림', '<80', AppColors.error),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard(String label, String value) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.1),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          children: [
            Text(label, style: const TextStyle(color: Colors.white54, fontSize: 11)),
            const SizedBox(height: 4),
            Text(
              value,
              style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRangeLabel(String label, String range, Color color) {
    return Expanded(
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 8,
                height: 8,
                decoration: BoxDecoration(color: color, shape: BoxShape.circle),
              ),
              const SizedBox(width: 4),
              Text(label, style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.bold)),
            ],
          ),
          Text(range, style: TextStyle(color: color.withOpacity(0.7), fontSize: 9)),
        ],
      ),
    );
  }
}
