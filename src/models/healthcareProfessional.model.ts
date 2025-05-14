class HealthcareProfessional {
  //   HealthcareProfessionals
  // Uid | A, B
  // firstName
  // lastName
  // Role
  // premiumServices: []
  // createdAt
  // updatedAt
  // deletedAt
  uid: string;
  firstName: string;
  lastName: string;
  role: string;
  premiumServices: string[];
  createdAt: string; // Date.toISOString()
  updatedAt: string; // Date.toISOString()
  deletedAt: string | null; // Date.toISOString()

  constructor(uid: string, firstName: string, lastName: string, role: string) {
    this.uid = uid;
    this.firstName = firstName;
    this.lastName = lastName;
    this.role = role;
    this.premiumServices = [];
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
    this.deletedAt = null;
  }

  asObject() {
    return { ...this };
  }
}

export default HealthcareProfessional;
