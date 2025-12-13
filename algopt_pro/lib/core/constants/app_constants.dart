class AppConstants {
  // App Info
  static const String appName = '알고PT Pro';
  static const String appNameEn = 'AlgoPT Pro';
  static const String loadingMessage = '임상 데이터를 분석 중입니다...';

  // Touch UI Constants
  static const double minTouchTargetSize = 48.0;
  static const double buttonHeight = 56.0;
  static const double cardBorderRadius = 16.0;
  static const double chipBorderRadius = 20.0;

  // Chief Complaints (주호소) Tags
  static const List<String> chiefComplaintTags = [
    'Gait disturbance',
    'Balance deficit',
    'Fall risk',
    'Pain',
    'Spasticity',
    'Weakness',
    'ROM limitation',
    'Tremor',
    'Coordination deficit',
    'Sensory deficit',
    'Cognitive impairment',
    'ADL difficulty',
    'Transfer difficulty',
    'Posture abnormality',
    'Fatigue',
  ];

  // Body Parts for Pain Location
  static const List<String> bodyParts = [
    'Head',
    'Neck',
    'R.Shoulder',
    'L.Shoulder',
    'R.Elbow',
    'L.Elbow',
    'R.Wrist',
    'L.Wrist',
    'R.Hand',
    'L.Hand',
    'Chest',
    'Upper Back',
    'Lower Back',
    'R.Hip',
    'L.Hip',
    'R.Knee',
    'L.Knee',
    'R.Ankle',
    'L.Ankle',
    'R.Foot',
    'L.Foot',
  ];

  // MAS Grades (Modified Ashworth Scale)
  static const List<String> masGrades = ['G0', 'G1', 'G1+', 'G2', 'G3', 'G4'];
  static const Map<String, String> masGradeDescriptions = {
    'G0': 'No increase in muscle tone',
    'G1': 'Slight increase, catch and release',
    'G1+': 'Slight increase, catch followed by minimal resistance',
    'G2': 'Marked increase through most ROM',
    'G3': 'Considerable increase, passive movement difficult',
    'G4': 'Rigid in flexion or extension',
  };

  // MMT Grades (Manual Muscle Testing)
  static const List<String> mmtGrades = [
    'Zero',
    'Trace',
    'Poor-',
    'Poor',
    'Poor+',
    'Fair-',
    'Fair',
    'Fair+',
    'Good-',
    'Good',
    'Good+',
    'Normal',
  ];
  static const Map<String, int> mmtGradeValues = {
    'Zero': 0,
    'Trace': 1,
    'Poor-': 2,
    'Poor': 2,
    'Poor+': 2,
    'Fair-': 3,
    'Fair': 3,
    'Fair+': 3,
    'Good-': 4,
    'Good': 4,
    'Good+': 4,
    'Normal': 5,
  };

  // Muscle Groups for MMT
  static const List<String> muscleGroups = [
    'Shoulder Flexors',
    'Shoulder Extensors',
    'Shoulder Abductors',
    'Shoulder Adductors',
    'Elbow Flexors',
    'Elbow Extensors',
    'Wrist Flexors',
    'Wrist Extensors',
    'Finger Flexors',
    'Finger Extensors',
    'Hip Flexors',
    'Hip Extensors',
    'Hip Abductors',
    'Hip Adductors',
    'Knee Flexors',
    'Knee Extensors',
    'Ankle Dorsiflexors',
    'Ankle Plantarflexors',
  ];

  // ROM Movements
  static const Map<String, Map<String, int>> romNormalRanges = {
    'Shoulder Flexion': {'min': 0, 'max': 180},
    'Shoulder Extension': {'min': 0, 'max': 60},
    'Shoulder Abduction': {'min': 0, 'max': 180},
    'Shoulder Adduction': {'min': 0, 'max': 45},
    'Shoulder Internal Rotation': {'min': 0, 'max': 70},
    'Shoulder External Rotation': {'min': 0, 'max': 90},
    'Elbow Flexion': {'min': 0, 'max': 150},
    'Elbow Extension': {'min': 0, 'max': 0},
    'Forearm Supination': {'min': 0, 'max': 80},
    'Forearm Pronation': {'min': 0, 'max': 80},
    'Wrist Flexion': {'min': 0, 'max': 80},
    'Wrist Extension': {'min': 0, 'max': 70},
    'Hip Flexion': {'min': 0, 'max': 120},
    'Hip Extension': {'min': 0, 'max': 30},
    'Hip Abduction': {'min': 0, 'max': 45},
    'Hip Adduction': {'min': 0, 'max': 30},
    'Hip Internal Rotation': {'min': 0, 'max': 45},
    'Hip External Rotation': {'min': 0, 'max': 45},
    'Knee Flexion': {'min': 0, 'max': 135},
    'Knee Extension': {'min': 0, 'max': 0},
    'Ankle Dorsiflexion': {'min': 0, 'max': 20},
    'Ankle Plantarflexion': {'min': 0, 'max': 50},
  };
}
