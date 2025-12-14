import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../core/theme/app_theme.dart';

class DualTaskScreen extends StatefulWidget {
  const DualTaskScreen({super.key});

  @override
  State<DualTaskScreen> createState() => _DualTaskScreenState();
}

class _DualTaskScreenState extends State<DualTaskScreen> {
  int _mode = 0; // 0: math, 1: words, 2: colors
  bool _isRunning = false;
  int _interval = 5; // seconds
  int _questionCount = 0;
  int _mathNumber = 100;
  bool _showAnswer = false;
  Timer? _timer;
  Map<String, dynamic>? _currentQuestion;
  List<Map<String, dynamic>> _history = [];
  final Random _random = Random();

  final List<Map<String, dynamic>> _wordCategories = [
    {'name': '동물', 'words': ['호랑이', '사자', '코끼리', '기린', '원숭이', '펭귄', '독수리', '상어', '돌고래', '토끼']},
    {'name': '과일', 'words': ['사과', '바나나', '오렌지', '포도', '딸기', '수박', '참외', '복숭아', '배', '감']},
    {'name': '색깔', 'words': ['빨강', '파랑', '노랑', '초록', '보라', '주황', '분홍', '하양', '검정', '회색']},
    {'name': '도시', 'words': ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '수원', '제주', '춘천']},
  ];

  final List<Map<String, dynamic>> _colorData = [
    {'name': '빨강', 'color': Colors.red},
    {'name': '파랑', 'color': Colors.blue},
    {'name': '노랑', 'color': Colors.yellow},
    {'name': '초록', 'color': Colors.green},
    {'name': '보라', 'color': Colors.purple},
    {'name': '주황', 'color': Colors.orange},
    {'name': '분홍', 'color': Colors.pink},
  ];

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _generateQuestion() {
    Map<String, dynamic> question;

    switch (_mode) {
      case 0: // Math (Serial 7s)
        final answer = _mathNumber - 7;
        question = {
          'type': 'math',
          'display': '$_mathNumber - 7 = ?',
          'answer': answer.toString(),
        };
        _mathNumber = answer > 0 ? answer : 100;
        break;
      case 1: // Words
        final category = _wordCategories[_random.nextInt(_wordCategories.length)];
        question = {
          'type': 'words',
          'display': '${category['name']} 이름을 말해보세요',
          'answer': (category['words'] as List)[_random.nextInt((category['words'] as List).length)],
        };
        break;
      case 2: // Colors (Stroop)
        final textColor = _colorData[_random.nextInt(_colorData.length)];
        final displayColor = _colorData[_random.nextInt(_colorData.length)];
        question = {
          'type': 'colors',
          'display': textColor['name'],
          'displayColor': displayColor['color'],
          'answer': displayColor['name'],
        };
        break;
      default:
        question = {'type': 'math', 'display': '100 - 7 = ?', 'answer': '93'};
    }

    setState(() {
      _currentQuestion = question;
      _questionCount++;
      _showAnswer = false;
    });

    _history.insert(0, question);
    if (_history.length > 20) _history.removeLast();

    HapticFeedback.mediumImpact();
  }

  void _startSession() {
    setState(() {
      _isRunning = true;
      _questionCount = 0;
      _mathNumber = 100;
      _history = [];
    });

    _generateQuestion();

    _timer = Timer.periodic(Duration(seconds: _interval), (timer) {
      _generateQuestion();
    });
  }

  void _stopSession() {
    _timer?.cancel();
    setState(() {
      _isRunning = false;
      _currentQuestion = null;
    });
  }

  void _nextQuestion() {
    _timer?.cancel();
    _generateQuestion();
    _timer = Timer.periodic(Duration(seconds: _interval), (timer) {
      _generateQuestion();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF78350F),
      appBar: AppBar(
        backgroundColor: const Color(0xFF78350F),
        foregroundColor: Colors.white,
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Dual Task Generator', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            Text('인지-운동 이중 과제', style: TextStyle(fontSize: 12, color: Colors.white70)),
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
                    _buildModeButton(0, '🔢', '산수'),
                    _buildModeButton(1, '💬', '단어'),
                    _buildModeButton(2, '🎨', '색깔'),
                  ],
                ),
              ),
            ),

            // Question Display
            Expanded(
              child: Center(
                child: _currentQuestion != null
                    ? Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          if (_currentQuestion!['type'] == 'colors')
                            Text(
                              _currentQuestion!['display'],
                              style: TextStyle(
                                fontSize: 64,
                                fontWeight: FontWeight.bold,
                                color: _currentQuestion!['displayColor'],
                              ),
                            )
                          else
                            Text(
                              _currentQuestion!['display'],
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontSize: _currentQuestion!['type'] == 'math' ? 48 : 32,
                                fontWeight: FontWeight.w600,
                                color: Colors.white,
                              ),
                            ),
                          if (_showAnswer) ...[
                            const SizedBox(height: 24),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                              decoration: BoxDecoration(
                                color: AppColors.success.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                '정답: ${_currentQuestion!['answer']}',
                                style: const TextStyle(
                                  color: AppColors.success,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 18,
                                ),
                              ),
                            ),
                          ],
                          const SizedBox(height: 24),
                          Text(
                            '문제 #$_questionCount',
                            style: const TextStyle(color: Colors.white54, fontSize: 16),
                          ),
                        ],
                      )
                    : const Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text('🧠', style: TextStyle(fontSize: 64)),
                          SizedBox(height: 16),
                          Text(
                            '시작 버튼을 눌러주세요',
                            style: TextStyle(color: Colors.white70, fontSize: 16),
                          ),
                        ],
                      ),
              ),
            ),

            // Controls
            Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  if (!_isRunning)
                    _buildButton('▶  시작', AppColors.success, _startSession)
                  else ...[
                    Row(
                      children: [
                        Expanded(
                          child: _buildButton(
                            '👁️ 정답',
                            Colors.white.withOpacity(0.1),
                            () => setState(() => _showAnswer = true),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _buildButton('⏭️ 다음', AppColors.warning, _nextQuestion),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    _buildButton('⏹ 정지', AppColors.error, _stopSession),
                  ],
                ],
              ),
            ),

            // Settings
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
                  const Text('⚙️ 설정', style: TextStyle(color: Colors.white70, fontSize: 12)),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      const Text('문제 간격', style: TextStyle(color: Colors.white, fontSize: 14)),
                      const Spacer(),
                      Text('${_interval}초', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  const SizedBox(height: 8),
                  SliderTheme(
                    data: SliderTheme.of(context).copyWith(
                      activeTrackColor: AppColors.warning,
                      inactiveTrackColor: Colors.white24,
                      thumbColor: Colors.white,
                    ),
                    child: Slider(
                      value: _interval.toDouble(),
                      min: 3,
                      max: 15,
                      divisions: 12,
                      onChanged: _isRunning
                          ? null
                          : (value) => setState(() => _interval = value.round()),
                    ),
                  ),
                ],
              ),
            ),

            // Mode Description
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
                  Text(
                    '💡 ${_getModeTitle()}',
                    style: const TextStyle(color: Colors.white70, fontSize: 12),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    _getModeDescription(),
                    style: const TextStyle(color: Colors.white, fontSize: 13, height: 1.5),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildModeButton(int mode, String icon, String label) {
    final isSelected = _mode == mode;
    return Expanded(
      child: GestureDetector(
        onTap: _isRunning
            ? null
            : () => setState(() {
                  _mode = mode;
                  _mathNumber = 100;
                }),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: isSelected ? AppColors.warning : Colors.transparent,
            borderRadius: BorderRadius.circular(10),
          ),
          child: Column(
            children: [
              Text(icon, style: const TextStyle(fontSize: 24)),
              const SizedBox(height: 4),
              Text(
                label,
                style: TextStyle(
                  color: isSelected ? Colors.white : Colors.white70,
                  fontWeight: FontWeight.bold,
                  fontSize: 12,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildButton(String label, Color color, VoidCallback onTap) {
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
            style: const TextStyle(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ),
    );
  }

  String _getModeTitle() {
    switch (_mode) {
      case 0:
        return 'Serial 7s Test';
      case 1:
        return 'Verbal Fluency';
      case 2:
        return 'Stroop Test';
      default:
        return '';
    }
  }

  String _getModeDescription() {
    switch (_mode) {
      case 0:
        return '100에서 시작하여 7씩 빼는 계산을 합니다. 인지 기능 평가에 널리 사용되며, 보행과 함께 수행 시 이중 과제 비용(Dual-Task Cost)을 측정할 수 있습니다.';
      case 1:
        return '주어진 카테고리에 맞는 단어를 말합니다. 의미적 언어 유창성을 평가하며, 전두엽 기능과 관련됩니다.';
      case 2:
        return '글자의 색깔을 말합니다 (글자 내용 무시). 선택적 주의력과 인지적 유연성을 평가합니다.';
      default:
        return '';
    }
  }
}
