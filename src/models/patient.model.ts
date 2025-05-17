// Uid
// firstName
// lastName
// healthCareProfessionals: [A, B]

class Patient {
  // Uid
  // firstName
  // lastName
  // healthCareProfessionals: [A, B]

  uid: string;
  firstName: string;
  lastName: string;
  healthCareProfessionals: string[];
  createdAt: string; // Date.toISOString()
  updatedAt: string; // Date.toISOString()
  deletedAt: string | null; // Date.toISOString()

  constructor(
    uid: string,
    firstName: string,
    lastName: string,
    healthCareProfessionals: string[],
  ) {
    this.uid = uid;
    this.firstName = firstName;
    this.lastName = lastName;
    this.healthCareProfessionals = healthCareProfessionals;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
    this.deletedAt = null;
  }

  asObject() {
    return { ...this };
  }
}

export default Patient;
