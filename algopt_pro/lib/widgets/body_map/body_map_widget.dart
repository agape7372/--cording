import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';

class BodyMapWidget extends StatelessWidget {
  final Map<String, int> selectedParts;
  final Function(String part) onPartSelected;
  final bool showFront;

  const BodyMapWidget({
    super.key,
    required this.selectedParts,
    required this.onPartSelected,
    this.showFront = true,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 280,
      height: 420,
      child: CustomPaint(
        painter: _BodyMapPainter(
          selectedParts: selectedParts,
          showFront: showFront,
        ),
        child: Stack(
          children: _buildTouchAreas(),
        ),
      ),
    );
  }

  List<Widget> _buildTouchAreas() {
    final touchAreas = <Widget>[];

    final bodyPartPositions = {
      'Head': const Rect.fromLTWH(115, 10, 50, 50),
      'Neck': const Rect.fromLTWH(120, 55, 40, 25),
      'R.Shoulder': const Rect.fromLTWH(65, 75, 50, 40),
      'L.Shoulder': const Rect.fromLTWH(165, 75, 50, 40),
      'Chest': const Rect.fromLTWH(100, 85, 80, 55),
      'R.Elbow': const Rect.fromLTWH(40, 135, 40, 40),
      'L.Elbow': const Rect.fromLTWH(200, 135, 40, 40),
      'Upper Back': const Rect.fromLTWH(100, 85, 80, 55),
      'Lower Back': const Rect.fromLTWH(105, 145, 70, 45),
      'R.Wrist': const Rect.fromLTWH(20, 190, 35, 30),
      'L.Wrist': const Rect.fromLTWH(225, 190, 35, 30),
      'R.Hand': const Rect.fromLTWH(10, 220, 40, 35),
      'L.Hand': const Rect.fromLTWH(230, 220, 40, 35),
      'R.Hip': const Rect.fromLTWH(85, 195, 45, 45),
      'L.Hip': const Rect.fromLTWH(150, 195, 45, 45),
      'R.Knee': const Rect.fromLTWH(90, 290, 40, 40),
      'L.Knee': const Rect.fromLTWH(150, 290, 40, 40),
      'R.Ankle': const Rect.fromLTWH(90, 365, 35, 25),
      'L.Ankle': const Rect.fromLTWH(155, 365, 35, 25),
      'R.Foot': const Rect.fromLTWH(85, 390, 40, 25),
      'L.Foot': const Rect.fromLTWH(155, 390, 40, 25),
    };

    bodyPartPositions.forEach((part, rect) {
      final isSelected = selectedParts.containsKey(part);
      final painLevel = selectedParts[part] ?? 0;

      touchAreas.add(
        Positioned(
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          child: GestureDetector(
            onTap: () => onPartSelected(part),
            child: Container(
              decoration: BoxDecoration(
                color: isSelected
                    ? _getPainColor(painLevel).withAlpha(100)
                    : Colors.transparent,
                borderRadius: BorderRadius.circular(8),
                border: isSelected
                    ? Border.all(color: _getPainColor(painLevel), width: 2)
                    : null,
              ),
              child: isSelected
                  ? Center(
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: _getPainColor(painLevel),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Text(
                          '$painLevel',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    )
                  : null,
            ),
          ),
        ),
      );
    });

    return touchAreas;
  }

  Color _getPainColor(int level) {
    if (level <= 3) {
      return Color.lerp(
          AppColors.painLow, AppColors.painMedium, level / 3)!;
    } else if (level <= 6) {
      return Color.lerp(
          AppColors.painMedium, AppColors.painHigh, (level - 3) / 3)!;
    } else {
      return AppColors.painHigh;
    }
  }
}

class _BodyMapPainter extends CustomPainter {
  final Map<String, int> selectedParts;
  final bool showFront;

  _BodyMapPainter({
    required this.selectedParts,
    required this.showFront,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = AppColors.primaryBlue.withAlpha(180)
      ..style = PaintingStyle.fill;

    final outlinePaint = Paint()
      ..color = AppColors.primaryBlueDark
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2;

    final centerX = size.width / 2;

    // Head
    canvas.drawOval(
      Rect.fromCenter(
        center: Offset(centerX, 35),
        width: 45,
        height: 50,
      ),
      paint,
    );
    canvas.drawOval(
      Rect.fromCenter(
        center: Offset(centerX, 35),
        width: 45,
        height: 50,
      ),
      outlinePaint,
    );

    // Neck
    canvas.drawRect(
      Rect.fromCenter(
        center: Offset(centerX, 68),
        width: 25,
        height: 18,
      ),
      paint,
    );

    // Torso
    final torsoPath = Path();
    torsoPath.moveTo(centerX - 50, 80);
    torsoPath.lineTo(centerX + 50, 80);
    torsoPath.lineTo(centerX + 45, 195);
    torsoPath.lineTo(centerX - 45, 195);
    torsoPath.close();
    canvas.drawPath(torsoPath, paint);
    canvas.drawPath(torsoPath, outlinePaint);

    // Right Arm
    _drawArm(canvas, centerX - 55, 90, -1, paint, outlinePaint);

    // Left Arm
    _drawArm(canvas, centerX + 55, 90, 1, paint, outlinePaint);

    // Pelvis
    final pelvisPath = Path();
    pelvisPath.moveTo(centerX - 45, 195);
    pelvisPath.lineTo(centerX + 45, 195);
    pelvisPath.lineTo(centerX + 35, 240);
    pelvisPath.lineTo(centerX - 35, 240);
    pelvisPath.close();
    canvas.drawPath(pelvisPath, paint);
    canvas.drawPath(pelvisPath, outlinePaint);

    // Right Leg
    _drawLeg(canvas, centerX - 25, 240, paint, outlinePaint);

    // Left Leg
    _drawLeg(canvas, centerX + 25, 240, paint, outlinePaint);
  }

  void _drawArm(Canvas canvas, double startX, double startY, int direction,
      Paint fill, Paint outline) {
    // Upper arm
    final upperArmPath = Path();
    upperArmPath.moveTo(startX, startY);
    upperArmPath.lineTo(startX + direction * 10, startY);
    upperArmPath.lineTo(startX + direction * 35, startY + 70);
    upperArmPath.lineTo(startX + direction * 20, startY + 75);
    upperArmPath.close();
    canvas.drawPath(upperArmPath, fill);
    canvas.drawPath(upperArmPath, outline);

    // Forearm
    final forearmPath = Path();
    forearmPath.moveTo(startX + direction * 35, startY + 70);
    forearmPath.lineTo(startX + direction * 20, startY + 75);
    forearmPath.lineTo(startX + direction * 45, startY + 145);
    forearmPath.lineTo(startX + direction * 55, startY + 140);
    forearmPath.close();
    canvas.drawPath(forearmPath, fill);
    canvas.drawPath(forearmPath, outline);

    // Hand
    canvas.drawOval(
      Rect.fromCenter(
        center: Offset(startX + direction * 55, startY + 160),
        width: 25,
        height: 30,
      ),
      fill,
    );
    canvas.drawOval(
      Rect.fromCenter(
        center: Offset(startX + direction * 55, startY + 160),
        width: 25,
        height: 30,
      ),
      outline,
    );
  }

  void _drawLeg(Canvas canvas, double centerX, double startY, Paint fill,
      Paint outline) {
    // Upper leg
    final upperLegPath = Path();
    upperLegPath.moveTo(centerX - 18, startY);
    upperLegPath.lineTo(centerX + 18, startY);
    upperLegPath.lineTo(centerX + 15, startY + 95);
    upperLegPath.lineTo(centerX - 15, startY + 95);
    upperLegPath.close();
    canvas.drawPath(upperLegPath, fill);
    canvas.drawPath(upperLegPath, outline);

    // Lower leg
    final lowerLegPath = Path();
    lowerLegPath.moveTo(centerX - 13, startY + 100);
    lowerLegPath.lineTo(centerX + 13, startY + 100);
    lowerLegPath.lineTo(centerX + 12, startY + 165);
    lowerLegPath.lineTo(centerX - 12, startY + 165);
    lowerLegPath.close();
    canvas.drawPath(lowerLegPath, fill);
    canvas.drawPath(lowerLegPath, outline);

    // Foot
    canvas.drawOval(
      Rect.fromCenter(
        center: Offset(centerX, startY + 175),
        width: 28,
        height: 18,
      ),
      fill,
    );
    canvas.drawOval(
      Rect.fromCenter(
        center: Offset(centerX, startY + 175),
        width: 28,
        height: 18,
      ),
      outline,
    );
  }

  @override
  bool shouldRepaint(covariant _BodyMapPainter oldDelegate) {
    return selectedParts != oldDelegate.selectedParts;
  }
}

class BodyPartSelector extends StatelessWidget {
  final List<String> bodyParts;
  final Set<String> selectedParts;
  final Function(String) onPartToggled;

  const BodyPartSelector({
    super.key,
    required this.bodyParts,
    required this.selectedParts,
    required this.onPartToggled,
  });

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: bodyParts.map((part) {
        final isSelected = selectedParts.contains(part);
        return GestureDetector(
          onTap: () => onPartToggled(part),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            decoration: BoxDecoration(
              color: isSelected ? AppColors.primaryBlue : AppColors.cardGrey,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              part,
              style: TextStyle(
                color: isSelected ? Colors.white : AppColors.textPrimary,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        );
      }).toList(),
    );
  }
}
