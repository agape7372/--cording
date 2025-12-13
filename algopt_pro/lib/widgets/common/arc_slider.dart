import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';

class ArcSlider extends StatefulWidget {
  final double value;
  final double min;
  final double max;
  final ValueChanged<double> onChanged;
  final double size;
  final bool showValue;
  final String? unit;
  final List<Color>? gradientColors;

  const ArcSlider({
    super.key,
    required this.value,
    this.min = 0,
    this.max = 10,
    required this.onChanged,
    this.size = 200,
    this.showValue = true,
    this.unit,
    this.gradientColors,
  });

  @override
  State<ArcSlider> createState() => _ArcSliderState();
}

class _ArcSliderState extends State<ArcSlider> {
  late double _currentValue;

  @override
  void initState() {
    super.initState();
    _currentValue = widget.value;
  }

  @override
  void didUpdateWidget(ArcSlider oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.value != oldWidget.value) {
      _currentValue = widget.value;
    }
  }

  void _updateValue(Offset position, Size size) {
    final center = Offset(size.width / 2, size.height);
    final dx = position.dx - center.dx;
    final dy = center.dy - position.dy;

    var angle = math.atan2(dy, dx);
    if (angle < 0) angle = math.pi;
    angle = math.pi - angle;

    final normalizedValue = angle / math.pi;
    final newValue =
        widget.min + (normalizedValue * (widget.max - widget.min));
    final clampedValue = newValue.clamp(widget.min, widget.max);

    setState(() {
      _currentValue = clampedValue;
    });
    widget.onChanged(clampedValue);
  }

  Color _getValueColor() {
    final ratio = (_currentValue - widget.min) / (widget.max - widget.min);
    if (widget.gradientColors != null && widget.gradientColors!.length >= 2) {
      if (ratio < 0.5) {
        return Color.lerp(widget.gradientColors![0],
            widget.gradientColors![1], ratio * 2)!;
      } else {
        return Color.lerp(widget.gradientColors![1],
            widget.gradientColors![2], (ratio - 0.5) * 2)!;
      }
    }
    return AppColors.primaryBlue;
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onPanUpdate: (details) {
        final box = context.findRenderObject() as RenderBox;
        final localPosition = box.globalToLocal(details.globalPosition);
        _updateValue(localPosition, box.size);
      },
      onTapDown: (details) {
        final box = context.findRenderObject() as RenderBox;
        final localPosition = box.globalToLocal(details.globalPosition);
        _updateValue(localPosition, box.size);
      },
      child: SizedBox(
        width: widget.size,
        height: widget.size * 0.6,
        child: CustomPaint(
          painter: _ArcSliderPainter(
            value: _currentValue,
            min: widget.min,
            max: widget.max,
            valueColor: _getValueColor(),
            gradientColors: widget.gradientColors,
          ),
          child: widget.showValue
              ? Center(
                  child: Padding(
                    padding: const EdgeInsets.only(top: 20),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          _currentValue.round().toString(),
                          style: TextStyle(
                            fontSize: widget.size * 0.18,
                            fontWeight: FontWeight.bold,
                            color: _getValueColor(),
                          ),
                        ),
                        if (widget.unit != null)
                          Text(
                            widget.unit!,
                            style: TextStyle(
                              fontSize: widget.size * 0.08,
                              color: AppColors.textSecondary,
                            ),
                          ),
                      ],
                    ),
                  ),
                )
              : null,
        ),
      ),
    );
  }
}

class _ArcSliderPainter extends CustomPainter {
  final double value;
  final double min;
  final double max;
  final Color valueColor;
  final List<Color>? gradientColors;

  _ArcSliderPainter({
    required this.value,
    required this.min,
    required this.max,
    required this.valueColor,
    this.gradientColors,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height);
    final radius = size.width * 0.45;
    final strokeWidth = size.width * 0.08;

    // Background arc
    final backgroundPaint = Paint()
      ..color = AppColors.cardGrey
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;

    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      math.pi,
      math.pi,
      false,
      backgroundPaint,
    );

    // Value arc
    final normalizedValue = (value - min) / (max - min);
    final sweepAngle = math.pi * normalizedValue;

    if (gradientColors != null && gradientColors!.length >= 2) {
      final gradientPaint = Paint()
        ..shader = SweepGradient(
          center: Alignment.bottomCenter,
          startAngle: math.pi,
          endAngle: 2 * math.pi,
          colors: gradientColors!,
        ).createShader(Rect.fromCircle(center: center, radius: radius))
        ..style = PaintingStyle.stroke
        ..strokeWidth = strokeWidth
        ..strokeCap = StrokeCap.round;

      canvas.drawArc(
        Rect.fromCircle(center: center, radius: radius),
        math.pi,
        sweepAngle,
        false,
        gradientPaint,
      );
    } else {
      final valuePaint = Paint()
        ..color = valueColor
        ..style = PaintingStyle.stroke
        ..strokeWidth = strokeWidth
        ..strokeCap = StrokeCap.round;

      canvas.drawArc(
        Rect.fromCircle(center: center, radius: radius),
        math.pi,
        sweepAngle,
        false,
        valuePaint,
      );
    }

    // Thumb
    final thumbAngle = math.pi + sweepAngle;
    final thumbX = center.dx + radius * math.cos(thumbAngle);
    final thumbY = center.dy + radius * math.sin(thumbAngle);

    final thumbPaint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.fill;

    final thumbShadowPaint = Paint()
      ..color = Colors.black26
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 4);

    canvas.drawCircle(Offset(thumbX, thumbY + 2), strokeWidth * 0.7, thumbShadowPaint);
    canvas.drawCircle(Offset(thumbX, thumbY), strokeWidth * 0.7, thumbPaint);

    final thumbInnerPaint = Paint()
      ..color = valueColor
      ..style = PaintingStyle.fill;

    canvas.drawCircle(Offset(thumbX, thumbY), strokeWidth * 0.4, thumbInnerPaint);
  }

  @override
  bool shouldRepaint(covariant _ArcSliderPainter oldDelegate) {
    return value != oldDelegate.value;
  }
}

class CircularAngleSlider extends StatefulWidget {
  final double angle;
  final double minAngle;
  final double maxAngle;
  final ValueChanged<double> onChanged;
  final double size;

  const CircularAngleSlider({
    super.key,
    required this.angle,
    this.minAngle = 0,
    this.maxAngle = 180,
    required this.onChanged,
    this.size = 180,
  });

  @override
  State<CircularAngleSlider> createState() => _CircularAngleSliderState();
}

class _CircularAngleSliderState extends State<CircularAngleSlider> {
  late double _currentAngle;

  @override
  void initState() {
    super.initState();
    _currentAngle = widget.angle;
  }

  @override
  void didUpdateWidget(CircularAngleSlider oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.angle != oldWidget.angle) {
      _currentAngle = widget.angle;
    }
  }

  void _updateAngle(Offset position, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final dx = position.dx - center.dx;
    final dy = position.dy - center.dy;

    var angle = math.atan2(dy, dx) * (180 / math.pi);
    angle = (angle + 90) % 360;
    if (angle > 180) angle = 360 - angle;

    final clampedAngle = angle.clamp(widget.minAngle, widget.maxAngle);

    setState(() {
      _currentAngle = clampedAngle;
    });
    widget.onChanged(clampedAngle);
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onPanUpdate: (details) {
        final box = context.findRenderObject() as RenderBox;
        final localPosition = box.globalToLocal(details.globalPosition);
        _updateAngle(localPosition, box.size);
      },
      onTapDown: (details) {
        final box = context.findRenderObject() as RenderBox;
        final localPosition = box.globalToLocal(details.globalPosition);
        _updateAngle(localPosition, box.size);
      },
      child: SizedBox(
        width: widget.size,
        height: widget.size,
        child: CustomPaint(
          painter: _CircularAnglePainter(
            angle: _currentAngle,
            minAngle: widget.minAngle,
            maxAngle: widget.maxAngle,
          ),
          child: Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  '${_currentAngle.round()}°',
                  style: TextStyle(
                    fontSize: widget.size * 0.15,
                    fontWeight: FontWeight.bold,
                    color: AppColors.primaryBlue,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _CircularAnglePainter extends CustomPainter {
  final double angle;
  final double minAngle;
  final double maxAngle;

  _CircularAnglePainter({
    required this.angle,
    required this.minAngle,
    required this.maxAngle,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width * 0.4;
    final strokeWidth = size.width * 0.06;

    // Background circle
    final backgroundPaint = Paint()
      ..color = AppColors.cardGrey
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth;

    canvas.drawCircle(center, radius, backgroundPaint);

    // Angle indicator
    final anglePaint = Paint()
      ..color = AppColors.primaryBlue
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;

    final startAngle = -math.pi / 2;
    final sweepAngle = (angle / 180) * math.pi;

    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      startAngle,
      sweepAngle,
      false,
      anglePaint,
    );

    // Angle line
    final linePaint = Paint()
      ..color = AppColors.primaryBlueDark
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3;

    final lineEndAngle = startAngle + sweepAngle;
    final lineEndX = center.dx + radius * math.cos(lineEndAngle);
    final lineEndY = center.dy + radius * math.sin(lineEndAngle);

    canvas.drawLine(center, Offset(lineEndX, lineEndY), linePaint);

    // Thumb
    final thumbPaint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.fill;

    canvas.drawCircle(Offset(lineEndX, lineEndY), strokeWidth * 0.8, thumbPaint);

    final thumbBorderPaint = Paint()
      ..color = AppColors.primaryBlue
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3;

    canvas.drawCircle(Offset(lineEndX, lineEndY), strokeWidth * 0.8, thumbBorderPaint);
  }

  @override
  bool shouldRepaint(covariant _CircularAnglePainter oldDelegate) {
    return angle != oldDelegate.angle;
  }
}
