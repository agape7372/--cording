class PatientData {
  String? name;
  int? age;
  String? gender;
  List<String> chiefComplaints;
  Map<String, int> painLocations; // body part -> VAS score
  DateTime? evaluationDate;

  PatientData({
    this.name,
    this.age,
    this.gender,
    List<String>? chiefComplaints,
    Map<String, int>? painLocations,
    this.evaluationDate,
  })  : chiefComplaints = chiefComplaints ?? [],
        painLocations = painLocations ?? {};

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'age': age,
      'gender': gender,
      'chiefComplaints': chiefComplaints,
      'painLocations': painLocations,
      'evaluationDate': evaluationDate?.toIso8601String(),
    };
  }

  factory PatientData.fromJson(Map<String, dynamic> json) {
    return PatientData(
      name: json['name'],
      age: json['age'],
      gender: json['gender'],
      chiefComplaints: List<String>.from(json['chiefComplaints'] ?? []),
      painLocations: Map<String, int>.from(json['painLocations'] ?? {}),
      evaluationDate: json['evaluationDate'] != null
          ? DateTime.parse(json['evaluationDate'])
          : null,
    );
  }

  String get genderDisplay {
    switch (gender) {
      case 'M':
        return 'Male';
      case 'F':
        return 'Female';
      default:
        return '-';
    }
  }

  void reset() {
    name = null;
    age = null;
    gender = null;
    chiefComplaints.clear();
    painLocations.clear();
    evaluationDate = null;
  }
}
