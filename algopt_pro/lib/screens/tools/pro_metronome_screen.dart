import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../core/theme/app_theme.dart';

class ProMetronomeScreen extends StatefulWidget {
  const ProMetronomeScreen({super.key});

  @override
  State<ProMetronomeScreen> createState() => _ProMetronomeScreenState();
}

class _ProMetronomeScreenState extends State<ProMetronomeScreen>
    with SingleTickerProviderStateMixin {
  int _bpm = 60;
  bool _isPlaying = false;
  bool _visualCue = true;
  bool _hapticCue = true;
  int _beatCount = 0;
  bool _flash = false;
  Timer? _timer;
  List<int> _tapTimes = [];

  late AnimationController _animationController;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 100),
    );
  }

  @override
  void dispose() {
    _timer?.cancel();
    _animationController.dispose();
    super.dispose();
  }

  void _startMetronome() {
    final interval = Duration(milliseconds: (60000 / _bpm).round());

    setState(() {
      _isPlaying = true;
      _beatCount = 0;
    });

    _playBeat(); // Play first beat immediately

    _timer = Timer.periodic(interval, (timer) {
      _playBeat();
    });
  }

  void _stopMetronome() {
    _timer?.cancel();
    setState(() {
      _isPlaying = false;
      _flash = false;
    });
  }

  void _playBeat() {
    setState(() {
      _beatCount++;
      if (_visualCue) {
        _flash = true;
      }
    });

    if (_hapticCue) {
      if (_beatCount % 4 == 1) {
        HapticFeedback.heavyImpact();
      } else {
        HapticFeedback.mediumImpact();
      }
    }

    // Visual flash
    if (_visualCue) {
      Future.delayed(const Duration(milliseconds: 50), () {
        if (mounted) {
          setState(() {
            _flash = false;
          });
        }
      });
    }
  }

  void _togglePlay() {
    if (_isPlaying) {
      _stopMetronome();
    } else {
      _startMetronome();
    }
  }

  void _changeBpm(int delta) {
    setState(() {
      _bpm = (_bpm + delta).clamp(20, 240);
    });
    if (_isPlaying) {
      _stopMetronome();
      _startMetronome();
    }
  }

  void _handleTapTempo() {
    final now = DateTime.now().millisecondsSinceEpoch;
    _tapTimes = _tapTimes.where((t) => now - t < 3000).toList();
    _tapTimes.add(now);

    if (_tapTimes.length >= 2) {
      final intervals = <int>[];
      for (int i = 1; i < _tapTimes.length; i++) {
        intervals.add(_tapTimes[i] - _tapTimes[i - 1]);
      }
      final avgInterval = intervals.reduce((a, b) => a + b) / intervals.length;
      setState(() {
        _bpm = (60000 / avgInterval).round().clamp(20, 240);
      });
    }
    HapticFeedback.selectionClick();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _flash && _visualCue
          ? AppColors.primaryBlue
          : const Color(0xFF0F172A),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        foregroundColor: Colors.white,
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Pro Metronome', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            Text('청각적 보행 훈련', style: TextStyle(fontSize: 12, color: Colors.white70)),
          ],
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            // BPM Display
            Expanded(
              flex: 3,
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      '$_bpm',
                      style: const TextStyle(
                        fontSize: 100,
                        fontWeight: FontWeight.w200,
                        color: Colors.white,
                        fontFamily: 'monospace',
                      ),
                    ),
                    const Text(
                      'BPM',
                      style: TextStyle(
                        fontSize: 24,
                        color: Colors.white70,
                        letterSpacing: 4,
                      ),
                    ),
                    if (_isPlaying)
                      Padding(
                        padding: const EdgeInsets.only(top: 16),
                        child: Text(
                          'Beat #$_beatCount',
                          style: const TextStyle(
                            color: Colors.white54,
                            fontSize: 16,
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ),

            // BPM Controls
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 32),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  _buildBpmButton('-10', () => _changeBpm(-10)),
                  const SizedBox(width: 12),
                  _buildBpmButton('−', () => _changeBpm(-1), large: true),
                  const SizedBox(width: 24),
                  _buildBpmButton('+', () => _changeBpm(1), large: true),
                  const SizedBox(width: 12),
                  _buildBpmButton('+10', () => _changeBpm(10)),
                ],
              ),
            ),

            // Slider
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
              child: Column(
                children: [
                  SliderTheme(
                    data: SliderTheme.of(context).copyWith(
                      activeTrackColor: AppColors.primaryBlue,
                      inactiveTrackColor: Colors.white24,
                      thumbColor: Colors.white,
                      trackHeight: 8,
                    ),
                    child: Slider(
                      value: _bpm.toDouble(),
                      min: 20,
                      max: 240,
                      onChanged: (value) {
                        setState(() {
                          _bpm = value.round();
                        });
                        if (_isPlaying) {
                          _stopMetronome();
                          _startMetronome();
                        }
                      },
                    ),
                  ),
                  const Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('20', style: TextStyle(color: Colors.white54, fontSize: 12)),
                      Text('120', style: TextStyle(color: Colors.white54, fontSize: 12)),
                      Text('240', style: TextStyle(color: Colors.white54, fontSize: 12)),
                    ],
                  ),
                ],
              ),
            ),

            // Play Button
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 24),
              child: GestureDetector(
                onTap: _togglePlay,
                child: Container(
                  width: 100,
                  height: 100,
                  decoration: BoxDecoration(
                    color: _isPlaying ? AppColors.error : AppColors.success,
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: (_isPlaying ? AppColors.error : AppColors.success).withOpacity(0.4),
                        blurRadius: 40,
                        spreadRadius: 10,
                      ),
                    ],
                  ),
                  child: Center(
                    child: Icon(
                      _isPlaying ? Icons.stop : Icons.play_arrow,
                      size: 48,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
            ),

            // Tap Tempo
            Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: OutlinedButton.icon(
                onPressed: _handleTapTempo,
                icon: const Icon(Icons.touch_app, color: Colors.white),
                label: const Text('Tap Tempo', style: TextStyle(color: Colors.white)),
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: Colors.white24, width: 2),
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                ),
              ),
            ),

            // Options
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  _buildOptionButton(
                    '👁️ 시각',
                    _visualCue,
                    () => setState(() => _visualCue = !_visualCue),
                  ),
                  const SizedBox(width: 16),
                  _buildOptionButton(
                    '📳 진동',
                    _hapticCue,
                    () => setState(() => _hapticCue = !_hapticCue),
                  ),
                ],
              ),
            ),

            // Presets
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  const Text(
                    '프리셋',
                    style: TextStyle(color: Colors.white54, fontSize: 12),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      _buildPresetButton(40, '느린\n보행'),
                      const SizedBox(width: 8),
                      _buildPresetButton(60, '정상\n보행'),
                      const SizedBox(width: 8),
                      _buildPresetButton(90, '빠른\n보행'),
                      const SizedBox(width: 8),
                      _buildPresetButton(120, '달리기'),
                    ],
                  ),
                ],
              ),
            ),

            // Clinical Info
            Container(
              margin: const EdgeInsets.fromLTRB(16, 0, 16, 16),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.05),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('💡 임상 적용', style: TextStyle(color: Colors.white70, fontSize: 12)),
                  SizedBox(height: 8),
                  Text(
                    '청각적 큐잉은 파킨슨병 환자의 보행 동결(Freezing of Gait)을 개선하는데 효과적입니다. 환자의 선호 케이던스보다 10-15% 빠른 BPM으로 시작하세요.',
                    style: TextStyle(color: Colors.white, fontSize: 13, height: 1.5),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBpmButton(String label, VoidCallback onTap, {bool large = false}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: large ? 56 : 48,
        height: large ? 56 : 48,
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(large ? 0.15 : 0.1),
          borderRadius: BorderRadius.circular(large ? 14 : 12),
        ),
        child: Center(
          child: Text(
            label,
            style: TextStyle(
              color: Colors.white,
              fontSize: large ? 24 : 16,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildOptionButton(String label, bool isActive, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        decoration: BoxDecoration(
          color: isActive ? AppColors.primaryBlue : Colors.white.withOpacity(0.1),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Text(
          '$label ${isActive ? "ON" : "OFF"}',
          style: const TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
    );
  }

  Widget _buildPresetButton(int bpm, String label) {
    final isSelected = _bpm == bpm;
    return Expanded(
      child: GestureDetector(
        onTap: () {
          setState(() => _bpm = bpm);
          if (_isPlaying) {
            _stopMetronome();
            _startMetronome();
          }
        },
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: isSelected ? AppColors.primaryBlue.withOpacity(0.2) : Colors.white.withOpacity(0.05),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(
              color: isSelected ? AppColors.primaryBlue : Colors.white.withOpacity(0.1),
              width: isSelected ? 2 : 1,
            ),
          ),
          child: Column(
            children: [
              Text(
                '$bpm',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                label,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  color: Colors.white54,
                  fontSize: 9,
                  height: 1.2,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
