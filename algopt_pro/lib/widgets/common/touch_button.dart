import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';

class TouchButton extends StatelessWidget {
  final String label;
  final VoidCallback onPressed;
  final bool isSelected;
  final bool isCompact;
  final IconData? icon;
  final Color? backgroundColor;
  final Color? foregroundColor;

  const TouchButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.isSelected = false,
    this.isCompact = false,
    this.icon,
    this.backgroundColor,
    this.foregroundColor,
  });

  @override
  Widget build(BuildContext context) {
    final bgColor = backgroundColor ??
        (isSelected ? AppColors.primaryBlue : AppColors.cardGrey);
    final fgColor = foregroundColor ??
        (isSelected ? Colors.white : AppColors.textPrimary);

    return Material(
      color: bgColor,
      borderRadius: BorderRadius.circular(12),
      elevation: isSelected ? 4 : 0,
      child: InkWell(
        onTap: onPressed,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          constraints: BoxConstraints(
            minHeight: isCompact ? 44 : 56,
            minWidth: isCompact ? 60 : 80,
          ),
          padding: EdgeInsets.symmetric(
            horizontal: isCompact ? 12 : 20,
            vertical: isCompact ? 8 : 14,
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (icon != null) ...[
                Icon(icon, color: fgColor, size: isCompact ? 18 : 22),
                SizedBox(width: isCompact ? 6 : 8),
              ],
              Text(
                label,
                style: TextStyle(
                  color: fgColor,
                  fontSize: isCompact ? 14 : 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class SegmentedButtonBar extends StatelessWidget {
  final List<String> options;
  final String? selectedOption;
  final ValueChanged<String> onSelected;
  final bool isCompact;

  const SegmentedButtonBar({
    super.key,
    required this.options,
    required this.selectedOption,
    required this.onSelected,
    this.isCompact = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.cardGrey,
        borderRadius: BorderRadius.circular(12),
      ),
      padding: const EdgeInsets.all(4),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: options.map((option) {
          final isSelected = option == selectedOption;
          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 2),
            child: GestureDetector(
              onTap: () => onSelected(option),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                constraints: BoxConstraints(
                  minHeight: isCompact ? 40 : 48,
                  minWidth: isCompact ? 44 : 52,
                ),
                decoration: BoxDecoration(
                  color: isSelected ? AppColors.primaryBlue : Colors.transparent,
                  borderRadius: BorderRadius.circular(8),
                ),
                padding: EdgeInsets.symmetric(
                  horizontal: isCompact ? 10 : 14,
                  vertical: isCompact ? 8 : 12,
                ),
                child: Center(
                  child: Text(
                    option,
                    style: TextStyle(
                      color: isSelected ? Colors.white : AppColors.textPrimary,
                      fontSize: isCompact ? 13 : 15,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}

class QuickActionButton extends StatelessWidget {
  final String label;
  final IconData icon;
  final VoidCallback onPressed;
  final Color? color;

  const QuickActionButton({
    super.key,
    required this.label,
    required this.icon,
    required this.onPressed,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    return ElevatedButton.icon(
      onPressed: onPressed,
      icon: Icon(icon),
      label: Text(label),
      style: ElevatedButton.styleFrom(
        backgroundColor: color ?? AppColors.accentMint,
        foregroundColor: Colors.white,
        minimumSize: const Size(120, 56),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
      ),
    );
  }
}
