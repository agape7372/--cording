import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../core/theme/app_theme.dart';

class ClinicalStopwatchScreen extends StatefulWidget {
  const ClinicalStopwatchScreen({super.key});

  @override
  State<ClinicalStopwatchScreen> createState() => _ClinicalStopwatchScreenState();
}

class _ClinicalStopwatchScreenState extends State<ClinicalStopwatchScreen> {
  // Mode: 0 = 10MWT, 1 = TUG
  int _mode = 0;
  bool _isRunning = false;
  int _elapsedMilliseconds = 0;
  Timer? _timer;
  List<Map<String, dynamic>> _laps = [];
  List<Map<String, dynamic>> _history = [];

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _startTimer() {
    if (!_isRunning) {
      setState(() {
        _isRunning = true;
      });
      _timer = Timer.periodic(const Duration(milliseconds: 10), (timer) {
        setState(() {
          _elapsedMilliseconds += 10;
        });
      });
      HapticFeedback.mediumImpact();
    }
  }

  void _pauseTimer() {
    if (_isRunning) {
      _timer?.cancel();
      setState(() {
        _isRunning = false;
      });
      HapticFeedback.mediumImpact();
    }
  }

  void _resetTimer() {
    _timer?.cancel();
    setState(() {
      _isRunning = false;
      _elapsedMilliseconds = 0;
      _laps = [];
    });
    HapticFeedback.lightImpact();
  }

  void _recordLap(String label) {
    if (_isRunning) {
      setState(() {
        _laps.add({'label': label, 'time': _elapsedMilliseconds});
      });
      HapticFeedback.selectionClick();
    }
  }

  void _saveResult() {
    if (_elapsedMilliseconds > 0) {
      final result = {
        'mode': _mode == 0 ? '10MWT' : 'TUG',
        'time': _elapsedMilliseconds,
        'speed': _mode == 0 ? _calculateGaitSpeed() : null,
        'laps': _mode == 1 ? List.from(_laps) : null,
        'timestamp': DateTime.now().toIso8601String(),
      };
      setState(() {
        _history.insert(0, result);
        if (_history.length > 10) _history.removeLast();
      });
      _resetTimer();
      HapticFeedback.heavyImpact();
    }
  }

  double? _calculateGaitSpeed() {
    if (_elapsedMilliseconds == 0) return null;
    return 10 / (_elapsedMilliseconds / 1000);
  }

  Map<String, dynamic>? _interpretGaitSpeed(double? speed) {
    if (speed == null) return null;
    if (speed >= 1.2) {
      return {'text': '정상 (Community Ambulator)', 'color': AppColors.success};
    } else if (speed >= 0.8) {
      return {'text': '제한적 지역사회 보행', 'color': AppColors.warning};
    } else if (speed >= 0.4) {
      return {'text': '가정 내 보행', 'color': AppColors.error};
    }
    return {'text': '심각한 보행 장애', 'color': Colors.red[900]};
  }

  String _formatTime(int ms, {bool showMs = true}) {
    final minutes = (ms ~/ 60000).toString().padLeft(2, '0');
    final seconds = ((ms ~/ 1000) % 60).toString().padLeft(2, '0');
    final milliseconds = ((ms % 1000) ~/ 10).toString().padLeft(2, '0');

    if (showMs) {
      return '$minutes:$seconds.$milliseconds';
    }
    return '$minutes:$seconds';
  }

  @override
  Widget build(BuildContext context) {
    final gaitSpeed = _calculateGaitSpeed();
    final interpretation = _interpretGaitSpeed(gaitSpeed);

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F172A),
        foregroundColor: Colors.white,
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Clinical Stopwatch', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            Text('고정밀 임상 타이머', style: TextStyle(fontSize: 12, color: Colors.white70)),
          ],
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Mode Selector
            Padding(
              padding: const EdgeInsets.all(16),
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.05),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: GestureDetector(
                        onTap: () {
                          setState(() {
                            _mode = 0;
                            _resetTimer();
                          });
                        },
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          decoration: BoxDecoration(
                            color: _mode == 0 ? AppColors.primaryBlue : Colors.transparent,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Center(
                            child: Text(
                              '10MWT',
                              style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ),
                      ),
                    ),
                    Expanded(
                      child: GestureDetector(
                        onTap: () {
                          setState(() {
                            _mode = 1;
                            _resetTimer();
                          });
                        },
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          decoration: BoxDecoration(
                            color: _mode == 1 ? AppColors.primaryBlue : Colors.transparent,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Center(
                            child: Text(
                              'TUG',
                              style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Timer Display
            Expanded(
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      _formatTime(_elapsedMilliseconds),
                      style: const TextStyle(
                        fontSize: 64,
                        fontWeight: FontWeight.w200,
                        color: Colors.white,
                        fontFamily: 'monospace',
                        letterSpacing: -2,
                      ),
                    ),
                    const SizedBox(height: 24),

                    // 10MWT Result
                    if (_mode == 0 && gaitSpeed != null) ...[
                      Container(
                        margin: const EdgeInsets.symmetric(horizontal: 32),
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.05),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Column(
                          children: [
                            const Text(
                              '보행 속도',
                              style: TextStyle(color: Colors.white70, fontSize: 14),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              '${gaitSpeed.toStringAsFixed(2)} m/s',
                              style: TextStyle(
                                fontSize: 48,
                                fontWeight: FontWeight.bold,
                                color: interpretation?['color'] ?? Colors.white,
                              ),
                            ),
                            if (interpretation != null) ...[
                              const SizedBox(height: 12),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                                decoration: BoxDecoration(
                                  color: (interpretation['color'] as Color).withOpacity(0.2),
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
                          ],
                        ),
                      ),
                    ],

                    // TUG Laps
                    if (_mode == 1 && _laps.isNotEmpty) ...[
                      Container(
                        margin: const EdgeInsets.symmetric(horizontal: 32),
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.05),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Column(
                          children: [
                            const Text(
                              '구간 기록',
                              style: TextStyle(color: Colors.white70, fontSize: 12),
                            ),
                            const SizedBox(height: 8),
                            ..._laps.map((lap) => Padding(
                              padding: const EdgeInsets.symmetric(vertical: 4),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(lap['label'], style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w500)),
                                  Text(_formatTime(lap['time']), style: const TextStyle(color: Colors.white70, fontFamily: 'monospace')),
                                ],
                              ),
                            )),
                          ],
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),

            // Controls
            Padding(
              padding: const EdgeInsets.all(24),
              child: _mode == 0 ? _build10MWTControls() : _buildTUGControls(),
            ),

            // TUG Guide
            if (_mode == 1)
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
                    const Text('TUG 검사 절차', style: TextStyle(color: Colors.white70, fontSize: 12)),
                    const SizedBox(height: 8),
                    const Text(
                      '1. Start: 의자에서 일어남\n2. Turn: 3m 지점에서 회전\n3. Back: 돌아와서\n4. Sit: 다시 앉음',
                      style: TextStyle(color: Colors.white, fontSize: 13, height: 1.6),
                    ),
                    const Divider(color: Colors.white24, height: 24),
                    Row(
                      children: [
                        _buildInterpretLabel('<10초', '정상', AppColors.success),
                        const SizedBox(width: 12),
                        _buildInterpretLabel('10-20초', '낙상 위험', AppColors.warning),
                        const SizedBox(width: 12),
                        _buildInterpretLabel('>20초', '높은 위험', AppColors.error),
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

  Widget _buildInterpretLabel(String time, String label, Color color) {
    return Expanded(
      child: Column(
        children: [
          Text(time, style: TextStyle(color: color, fontSize: 11, fontWeight: FontWeight.bold)),
          Text(label, style: TextStyle(color: color.withOpacity(0.7), fontSize: 10)),
        ],
      ),
    );
  }

  Widget _build10MWTControls() {
    if (!_isRunning && _elapsedMilliseconds == 0) {
      return _buildButton('▶  시작', AppColors.success, _startTimer);
    } else if (!_isRunning && _elapsedMilliseconds > 0) {
      return Row(
        children: [
          Expanded(child: _buildButton('▶  재개', AppColors.success, _startTimer)),
          const SizedBox(width: 12),
          Expanded(child: _buildButton('💾  저장', AppColors.primaryBlue, _saveResult)),
        ],
      );
    } else {
      return Column(
        children: [
          _buildButton('⏹  정지', AppColors.error, _pauseTimer),
          const SizedBox(height: 12),
          _buildButton('🔄  초기화', Colors.white24, _resetTimer, textColor: Colors.white),
        ],
      );
    }
  }

  Widget _buildTUGControls() {
    if (!_isRunning && _elapsedMilliseconds == 0) {
      return _buildButton('▶  Start (일어서기)', AppColors.success, _startTimer);
    } else if (_isRunning) {
      return Column(
        children: [
          Row(
            children: [
              Expanded(
                child: _buildButton(
                  '🔄 Turn',
                  _laps.any((l) => l['label'] == 'Turn') ? Colors.white24 : AppColors.warning,
                  _laps.any((l) => l['label'] == 'Turn') ? null : () => _recordLap('Turn'),
                  textColor: Colors.white,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildButton(
                  '↩️ Back',
                  (!_laps.any((l) => l['label'] == 'Turn') || _laps.any((l) => l['label'] == 'Back'))
                      ? Colors.white24
                      : const Color(0xFF8B5CF6),
                  (!_laps.any((l) => l['label'] == 'Turn') || _laps.any((l) => l['label'] == 'Back'))
                      ? null
                      : () => _recordLap('Back'),
                  textColor: Colors.white,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          _buildButton('🪑  Sit (완료)', AppColors.error, () {
            _recordLap('Sit');
            _pauseTimer();
          }),
        ],
      );
    } else {
      return Row(
        children: [
          Expanded(child: _buildButton('💾  저장', AppColors.primaryBlue, _saveResult)),
          const SizedBox(width: 12),
          Expanded(child: _buildButton('🔄  초기화', Colors.white24, _resetTimer, textColor: Colors.white)),
        ],
      );
    }
  }

  Widget _buildButton(String label, Color color, VoidCallback? onTap, {Color textColor = Colors.white}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Center(
          child: Text(
            label,
            style: TextStyle(
              color: textColor,
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ),
    );
  }
}
