import 'package:flutter_test/flutter_test.dart';

import 'package:algopt_pro/main.dart';

void main() {
  testWidgets('AlgoPT app loads successfully', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const AlgoPTApp());

    // Verify that the splash screen is displayed
    expect(find.text('알고PT Pro'), findsOneWidget);
    expect(find.text('AI Clinical Partner for Therapists'), findsOneWidget);
  });
}
