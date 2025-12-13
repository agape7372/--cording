import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';

class RomMannequinViewer extends StatelessWidget {
  final double shoulderFlexionAngle;
  final double shoulderAbductionAngle;
  final double elbowFlexionAngle;
  final double hipFlexionAngle;
  final double kneeFlexionAngle;
  final bool isRightSide;

  const RomMannequinViewer({
    super.key,
    this.shoulderFlexionAngle = 0,
    this.shoulderAbductionAngle = 0,
    this.elbowFlexionAngle = 0,
    this.hipFlexionAngle = 0,
    this.kneeFlexionAngle = 0,
    this.isRightSide = true,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 250,
      height: 380,
      child: CustomPaint(
        painter: _MannequinPainter(
          shoulderFlexionAngle: shoulderFlexionAngle,
          shoulderAbductionAngle: shoulderAbductionAngle,
          elbowFlexionAngle: elbowFlexionAngle,
          hipFlexionAngle: hipFlexionAngle,
          kneeFlexionAngle: kneeFlexionAngle,
          isRightSide: isRightSide,
        ),
      ),
    );
  }
}

class _MannequinPainter extends CustomPainter {
  final double shoulderFlexionAngle;
  final double shoulderAbductionAngle;
  final double elbowFlexionAngle;
  final double hipFlexionAngle;
  final double kneeFlexionAngle;
  final bool isRightSide;

  _MannequinPainter({
    required this.shoulderFlexionAngle,
    required this.shoulderAbductionAngle,
    required this.elbowFlexionAngle,
    required this.hipFlexionAngle,
    required this.kneeFlexionAngle,
    required this.isRightSide,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final centerX = size.width / 2;
    final scale = size.height / 380;

    // Colors
    final bodyPaint = Paint()
      ..color = AppColors.primaryBlue.withAlpha(200)
      ..style = PaintingStyle.fill;

    final jointPaint = Paint()
      ..color = AppColors.primaryBlueDark
      ..style = PaintingStyle.fill;

    final outlinePaint = Paint()
      ..color = AppColors.primaryBlueDark
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.5 * scale;

    final activeLimbPaint = Paint()
      ..color = AppColors.accentMint.withAlpha(220)
      ..style = PaintingStyle.fill;

    final activeJointPaint = Paint()
      ..color = AppColors.accentMintDark
      ..style = PaintingStyle.fill;

    // Head
    _drawHead(canvas, centerX, 35 * scale, 22 * scale, bodyPaint, outlinePaint);

    // Neck
    _drawNeck(canvas, centerX, 55 * scale, 12 * scale, 15 * scale, bodyPaint);

    // Torso
    _drawTorso(canvas, centerX, 75 * scale, 50 * scale, 85 * scale, bodyPaint, outlinePaint);

    // Pelvis
    _drawPelvis(canvas, centerX, 160 * scale, 45 * scale, 30 * scale, bodyPaint, outlinePaint);

    // Arms
    final rightArmPaint = isRightSide ? activeLimbPaint : bodyPaint;
    final rightJointPaint = isRightSide ? activeJointPaint : jointPaint;
    final leftArmPaint = !isRightSide ? activeLimbPaint : bodyPaint;
    final leftJointPaint = !isRightSide ? activeJointPaint : jointPaint;

    // Right Arm (with animation)
    _drawAnimatedArm(
      canvas,
      centerX - 55 * scale,
      85 * scale,
      scale,
      isRightSide ? shoulderFlexionAngle : 0,
      isRightSide ? elbowFlexionAngle : 0,
      true,
      rightArmPaint,
      rightJointPaint,
      outlinePaint,
    );

    // Left Arm (with animation)
    _drawAnimatedArm(
      canvas,
      centerX + 55 * scale,
      85 * scale,
      scale,
      !isRightSide ? shoulderFlexionAngle : 0,
      !isRightSide ? elbowFlexionAngle : 0,
      false,
      leftArmPaint,
      leftJointPaint,
      outlinePaint,
    );

    // Legs
    final rightLegPaint = isRightSide ? activeLimbPaint : bodyPaint;
    final rightLegJointPaint = isRightSide ? activeJointPaint : jointPaint;
    final leftLegPaint = !isRightSide ? activeLimbPaint : bodyPaint;
    final leftLegJointPaint = !isRightSide ? activeJointPaint : jointPaint;

    // Right Leg
    _drawAnimatedLeg(
      canvas,
      centerX - 22 * scale,
      185 * scale,
      scale,
      isRightSide ? hipFlexionAngle : 0,
      isRightSide ? kneeFlexionAngle : 0,
      rightLegPaint,
      rightLegJointPaint,
      outlinePaint,
    );

    // Left Leg
    _drawAnimatedLeg(
      canvas,
      centerX + 22 * scale,
      185 * scale,
      scale,
      !isRightSide ? hipFlexionAngle : 0,
      !isRightSide ? kneeFlexionAngle : 0,
      leftLegPaint,
      leftLegJointPaint,
      outlinePaint,
    );
  }

  void _drawHead(Canvas canvas, double cx, double cy, double radius,
      Paint fill, Paint outline) {
    // Head oval
    canvas.drawOval(
      Rect.fromCenter(center: Offset(cx, cy), width: radius * 2, height: radius * 2.2),
      fill,
    );
    canvas.drawOval(
      Rect.fromCenter(center: Offset(cx, cy), width: radius * 2, height: radius * 2.2),
      outline,
    );

    // Simple face indicator
    final facePaint = Paint()
      ..color = AppColors.surfaceWhite.withAlpha(100)
      ..style = PaintingStyle.fill;
    canvas.drawOval(
      Rect.fromCenter(center: Offset(cx, cy - 2), width: radius * 1.4, height: radius * 1.5),
      facePaint,
    );
  }

  void _drawNeck(Canvas canvas, double cx, double cy, double width,
      double height, Paint fill) {
    final path = Path();
    path.addRRect(RRect.fromRectAndRadius(
      Rect.fromCenter(center: Offset(cx, cy), width: width, height: height),
      const Radius.circular(3),
    ));
    canvas.drawPath(path, fill);
  }

  void _drawTorso(Canvas canvas, double cx, double cy, double width,
      double height, Paint fill, Paint outline) {
    final path = Path();
    path.moveTo(cx - width, cy);
    path.quadraticBezierTo(cx - width - 5, cy + height * 0.3, cx - width * 0.85, cy + height);
    path.lineTo(cx + width * 0.85, cy + height);
    path.quadraticBezierTo(cx + width + 5, cy + height * 0.3, cx + width, cy);
    path.close();
    canvas.drawPath(path, fill);
    canvas.drawPath(path, outline);

    // Shoulder caps
    canvas.drawOval(
      Rect.fromCenter(center: Offset(cx - width - 5, cy + 5), width: 18, height: 22),
      fill,
    );
    canvas.drawOval(
      Rect.fromCenter(center: Offset(cx + width + 5, cy + 5), width: 18, height: 22),
      fill,
    );
  }

  void _drawPelvis(Canvas canvas, double cx, double cy, double width,
      double height, Paint fill, Paint outline) {
    final path = Path();
    path.moveTo(cx - width, cy);
    path.lineTo(cx - width * 0.7, cy + height);
    path.quadraticBezierTo(cx, cy + height + 10, cx + width * 0.7, cy + height);
    path.lineTo(cx + width, cy);
    path.close();
    canvas.drawPath(path, fill);
    canvas.drawPath(path, outline);
  }

  void _drawAnimatedArm(
    Canvas canvas,
    double shoulderX,
    double shoulderY,
    double scale,
    double shoulderAngle,
    double elbowAngle,
    bool isRight,
    Paint limbPaint,
    Paint jointPaint,
    Paint outlinePaint,
  ) {
    canvas.save();
    canvas.translate(shoulderX, shoulderY);

    // Convert shoulder angle to radians (flexion moves arm forward/up)
    final shoulderRad = (shoulderAngle * math.pi / 180) * (isRight ? -1 : 1);
    canvas.rotate(shoulderRad);

    final upperArmLength = 55 * scale;
    final forearmLength = 50 * scale;
    final upperArmWidth = 16 * scale;
    final forearmWidth = 14 * scale;

    // Upper arm
    _drawLimbSegment(canvas, 0, 0, upperArmLength, upperArmWidth, limbPaint, outlinePaint);

    // Elbow joint
    canvas.drawCircle(Offset(0, upperArmLength), 10 * scale, jointPaint);

    // Forearm with elbow rotation
    canvas.save();
    canvas.translate(0, upperArmLength);
    final elbowRad = (elbowAngle * math.pi / 180);
    canvas.rotate(elbowRad);

    _drawLimbSegment(canvas, 0, 0, forearmLength, forearmWidth, limbPaint, outlinePaint);

    // Hand
    canvas.drawOval(
      Rect.fromCenter(
        center: Offset(0, forearmLength + 12 * scale),
        width: 16 * scale,
        height: 20 * scale,
      ),
      limbPaint,
    );
    canvas.drawOval(
      Rect.fromCenter(
        center: Offset(0, forearmLength + 12 * scale),
        width: 16 * scale,
        height: 20 * scale,
      ),
      outlinePaint,
    );

    canvas.restore();

    // Shoulder joint
    canvas.drawCircle(Offset.zero, 12 * scale, jointPaint);

    canvas.restore();
  }

  void _drawAnimatedLeg(
    Canvas canvas,
    double hipX,
    double hipY,
    double scale,
    double hipAngle,
    double kneeAngle,
    Paint limbPaint,
    Paint jointPaint,
    Paint outlinePaint,
  ) {
    canvas.save();
    canvas.translate(hipX, hipY);

    // Convert hip angle to radians (flexion moves leg forward)
    final hipRad = (hipAngle * math.pi / 180);
    canvas.rotate(hipRad);

    final thighLength = 75 * scale;
    final shinLength = 70 * scale;
    final thighWidth = 22 * scale;
    final shinWidth = 18 * scale;

    // Thigh
    _drawLimbSegment(canvas, 0, 0, thighLength, thighWidth, limbPaint, outlinePaint);

    // Knee joint
    canvas.drawCircle(Offset(0, thighLength), 12 * scale, jointPaint);

    // Shin with knee rotation
    canvas.save();
    canvas.translate(0, thighLength);
    final kneeRad = (kneeAngle * math.pi / 180);
    canvas.rotate(kneeRad);

    _drawLimbSegment(canvas, 0, 0, shinLength, shinWidth, limbPaint, outlinePaint);

    // Foot
    final footPath = Path();
    footPath.moveTo(-10 * scale, shinLength);
    footPath.lineTo(10 * scale, shinLength);
    footPath.lineTo(15 * scale, shinLength + 8 * scale);
    footPath.lineTo(20 * scale, shinLength + 15 * scale);
    footPath.lineTo(-8 * scale, shinLength + 15 * scale);
    footPath.close();
    canvas.drawPath(footPath, limbPaint);
    canvas.drawPath(footPath, outlinePaint);

    canvas.restore();

    // Hip joint
    canvas.drawCircle(Offset.zero, 14 * scale, jointPaint);

    canvas.restore();
  }

  void _drawLimbSegment(Canvas canvas, double x, double y, double length,
      double width, Paint fill, Paint outline) {
    final path = Path();
    path.addRRect(RRect.fromRectAndRadius(
      Rect.fromLTWH(x - width / 2, y, width, length),
      Radius.circular(width / 2),
    ));
    canvas.drawPath(path, fill);
    canvas.drawPath(path, outline);
  }

  @override
  bool shouldRepaint(covariant _MannequinPainter oldDelegate) {
    return shoulderFlexionAngle != oldDelegate.shoulderFlexionAngle ||
        shoulderAbductionAngle != oldDelegate.shoulderAbductionAngle ||
        elbowFlexionAngle != oldDelegate.elbowFlexionAngle ||
        hipFlexionAngle != oldDelegate.hipFlexionAngle ||
        kneeFlexionAngle != oldDelegate.kneeFlexionAngle ||
        isRightSide != oldDelegate.isRightSide;
  }
}

class InteractiveRomViewer extends StatefulWidget {
  final String movement;
  final double initialAngle;
  final double minAngle;
  final double maxAngle;
  final ValueChanged<double> onAngleChanged;
  final bool isRightSide;

  const InteractiveRomViewer({
    super.key,
    required this.movement,
    this.initialAngle = 0,
    this.minAngle = 0,
    this.maxAngle = 180,
    required this.onAngleChanged,
    this.isRightSide = true,
  });

  @override
  State<InteractiveRomViewer> createState() => _InteractiveRomViewerState();
}

class _InteractiveRomViewerState extends State<InteractiveRomViewer> {
  late double _currentAngle;

  @override
  void initState() {
    super.initState();
    _currentAngle = widget.initialAngle;
  }

  double get _shoulderFlexion {
    if (widget.movement.contains('Shoulder Flexion')) return _currentAngle;
    return 0;
  }

  double get _elbowFlexion {
    if (widget.movement.contains('Elbow Flexion')) return _currentAngle;
    return 0;
  }

  double get _hipFlexion {
    if (widget.movement.contains('Hip Flexion')) return _currentAngle;
    return 0;
  }

  double get _kneeFlexion {
    if (widget.movement.contains('Knee Flexion')) return _currentAngle;
    return 0;
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Movement title
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: AppColors.primaryBlue.withAlpha(30),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                widget.isRightSide ? Icons.arrow_back : Icons.arrow_forward,
                size: 18,
                color: AppColors.primaryBlue,
              ),
              const SizedBox(width: 8),
              Text(
                widget.movement,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: AppColors.primaryBlue,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // Mannequin and Slider side by side
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            // Mannequin
            RomMannequinViewer(
              shoulderFlexionAngle: _shoulderFlexion,
              elbowFlexionAngle: _elbowFlexion,
              hipFlexionAngle: _hipFlexion,
              kneeFlexionAngle: _kneeFlexion,
              isRightSide: widget.isRightSide,
            ),
            const SizedBox(width: 24),

            // Circular Slider
            Column(
              children: [
                SizedBox(
                  width: 160,
                  height: 160,
                  child: _buildCircularSlider(),
                ),
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                  decoration: BoxDecoration(
                    color: AppColors.primaryBlue,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    '${_currentAngle.round()}°',
                    style: const TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildCircularSlider() {
    return GestureDetector(
      onPanUpdate: _handlePanUpdate,
      onTapDown: _handleTapDown,
      child: CustomPaint(
        painter: _AngleDialPainter(
          angle: _currentAngle,
          minAngle: widget.minAngle,
          maxAngle: widget.maxAngle,
        ),
      ),
    );
  }

  void _handlePanUpdate(DragUpdateDetails details) {
    _updateAngleFromPosition(details.localPosition);
  }

  void _handleTapDown(TapDownDetails details) {
    _updateAngleFromPosition(details.localPosition);
  }

  void _updateAngleFromPosition(Offset position) {
    const size = Size(160, 160);
    final center = Offset(size.width / 2, size.height / 2);
    final dx = position.dx - center.dx;
    final dy = position.dy - center.dy;

    var angle = math.atan2(dy, dx) * (180 / math.pi);
    angle = (angle + 90) % 360;
    if (angle > 180) angle = 0;

    final clampedAngle = angle.clamp(widget.minAngle, widget.maxAngle);

    setState(() {
      _currentAngle = clampedAngle;
    });
    widget.onAngleChanged(clampedAngle);
  }
}

class _AngleDialPainter extends CustomPainter {
  final double angle;
  final double minAngle;
  final double maxAngle;

  _AngleDialPainter({
    required this.angle,
    required this.minAngle,
    required this.maxAngle,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width * 0.42;

    // Background circle
    final bgPaint = Paint()
      ..color = AppColors.cardGrey
      ..style = PaintingStyle.stroke
      ..strokeWidth = 12;

    canvas.drawCircle(center, radius, bgPaint);

    // Angle arc
    final anglePaint = Paint()
      ..color = AppColors.accentMint
      ..style = PaintingStyle.stroke
      ..strokeWidth = 12
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

    // Tick marks
    final tickPaint = Paint()
      ..color = AppColors.textSecondary
      ..strokeWidth = 2;

    for (int i = 0; i <= 180; i += 30) {
      final tickAngle = -math.pi / 2 + (i / 180) * math.pi;
      final outerPoint = Offset(
        center.dx + (radius + 15) * math.cos(tickAngle),
        center.dy + (radius + 15) * math.sin(tickAngle),
      );
      final innerPoint = Offset(
        center.dx + (radius + 8) * math.cos(tickAngle),
        center.dy + (radius + 8) * math.sin(tickAngle),
      );
      canvas.drawLine(innerPoint, outerPoint, tickPaint);

      // Labels
      final textPainter = TextPainter(
        text: TextSpan(
          text: '$i°',
          style: const TextStyle(
            fontSize: 10,
            color: AppColors.textSecondary,
          ),
        ),
        textDirection: TextDirection.ltr,
      );
      textPainter.layout();
      final labelPoint = Offset(
        center.dx + (radius + 28) * math.cos(tickAngle) - textPainter.width / 2,
        center.dy + (radius + 28) * math.sin(tickAngle) - textPainter.height / 2,
      );
      textPainter.paint(canvas, labelPoint);
    }

    // Thumb
    final thumbAngle = startAngle + sweepAngle;
    final thumbX = center.dx + radius * math.cos(thumbAngle);
    final thumbY = center.dy + radius * math.sin(thumbAngle);

    final thumbShadow = Paint()
      ..color = Colors.black26
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 4);

    canvas.drawCircle(Offset(thumbX, thumbY + 2), 14, thumbShadow);

    final thumbPaint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.fill;

    canvas.drawCircle(Offset(thumbX, thumbY), 14, thumbPaint);

    final thumbInner = Paint()
      ..color = AppColors.accentMint
      ..style = PaintingStyle.fill;

    canvas.drawCircle(Offset(thumbX, thumbY), 8, thumbInner);
  }

  @override
  bool shouldRepaint(covariant _AngleDialPainter oldDelegate) {
    return angle != oldDelegate.angle;
  }
}
