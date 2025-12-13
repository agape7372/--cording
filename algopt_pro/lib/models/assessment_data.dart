class AssessmentData {
  // MAS (Modified Ashworth Scale) - body part -> grade
  Map<String, String> masScores;

  // MMT (Manual Muscle Testing) - muscle group -> grade
  Map<String, String> mmtScoresRight;
  Map<String, String> mmtScoresLeft;

  // ROM - movement -> angle
  Map<String, int> romScoresRight;
  Map<String, int> romScoresLeft;
  Map<String, bool> romWnlRight; // Within Normal Limits flag
  Map<String, bool> romWnlLeft;

  // Assessment notes
  String? assessmentNotes;

  // Plan
  String? treatmentPlan;

  AssessmentData({
    Map<String, String>? masScores,
    Map<String, String>? mmtScoresRight,
    Map<String, String>? mmtScoresLeft,
    Map<String, int>? romScoresRight,
    Map<String, int>? romScoresLeft,
    Map<String, bool>? romWnlRight,
    Map<String, bool>? romWnlLeft,
    this.assessmentNotes,
    this.treatmentPlan,
  })  : masScores = masScores ?? {},
        mmtScoresRight = mmtScoresRight ?? {},
        mmtScoresLeft = mmtScoresLeft ?? {},
        romScoresRight = romScoresRight ?? {},
        romScoresLeft = romScoresLeft ?? {},
        romWnlRight = romWnlRight ?? {},
        romWnlLeft = romWnlLeft ?? {};

  void setAllMmtNormal() {
    const normalGrade = 'Normal';
    mmtScoresRight = {
      'Shoulder Flexors': normalGrade,
      'Shoulder Extensors': normalGrade,
      'Shoulder Abductors': normalGrade,
      'Shoulder Adductors': normalGrade,
      'Elbow Flexors': normalGrade,
      'Elbow Extensors': normalGrade,
      'Wrist Flexors': normalGrade,
      'Wrist Extensors': normalGrade,
      'Finger Flexors': normalGrade,
      'Finger Extensors': normalGrade,
      'Hip Flexors': normalGrade,
      'Hip Extensors': normalGrade,
      'Hip Abductors': normalGrade,
      'Hip Adductors': normalGrade,
      'Knee Flexors': normalGrade,
      'Knee Extensors': normalGrade,
      'Ankle Dorsiflexors': normalGrade,
      'Ankle Plantarflexors': normalGrade,
    };
    mmtScoresLeft = Map.from(mmtScoresRight);
  }

  void setAllRomWnl() {
    const movements = [
      'Shoulder Flexion',
      'Shoulder Extension',
      'Shoulder Abduction',
      'Shoulder Adduction',
      'Shoulder Internal Rotation',
      'Shoulder External Rotation',
      'Elbow Flexion',
      'Elbow Extension',
      'Forearm Supination',
      'Forearm Pronation',
      'Wrist Flexion',
      'Wrist Extension',
      'Hip Flexion',
      'Hip Extension',
      'Hip Abduction',
      'Hip Adduction',
      'Hip Internal Rotation',
      'Hip External Rotation',
      'Knee Flexion',
      'Knee Extension',
      'Ankle Dorsiflexion',
      'Ankle Plantarflexion',
    ];

    for (var movement in movements) {
      romWnlRight[movement] = true;
      romWnlLeft[movement] = true;
    }
  }

  Map<String, dynamic> toJson() {
    return {
      'masScores': masScores,
      'mmtScoresRight': mmtScoresRight,
      'mmtScoresLeft': mmtScoresLeft,
      'romScoresRight': romScoresRight,
      'romScoresLeft': romScoresLeft,
      'romWnlRight': romWnlRight,
      'romWnlLeft': romWnlLeft,
      'assessmentNotes': assessmentNotes,
      'treatmentPlan': treatmentPlan,
    };
  }

  factory AssessmentData.fromJson(Map<String, dynamic> json) {
    return AssessmentData(
      masScores: Map<String, String>.from(json['masScores'] ?? {}),
      mmtScoresRight: Map<String, String>.from(json['mmtScoresRight'] ?? {}),
      mmtScoresLeft: Map<String, String>.from(json['mmtScoresLeft'] ?? {}),
      romScoresRight: Map<String, int>.from(json['romScoresRight'] ?? {}),
      romScoresLeft: Map<String, int>.from(json['romScoresLeft'] ?? {}),
      romWnlRight: Map<String, bool>.from(json['romWnlRight'] ?? {}),
      romWnlLeft: Map<String, bool>.from(json['romWnlLeft'] ?? {}),
      assessmentNotes: json['assessmentNotes'],
      treatmentPlan: json['treatmentPlan'],
    );
  }

  void reset() {
    masScores.clear();
    mmtScoresRight.clear();
    mmtScoresLeft.clear();
    romScoresRight.clear();
    romScoresLeft.clear();
    romWnlRight.clear();
    romWnlLeft.clear();
    assessmentNotes = null;
    treatmentPlan = null;
  }
}
