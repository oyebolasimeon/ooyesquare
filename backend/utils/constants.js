// Nigerian States
const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
  'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo',
  'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna',
  'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
  'FCT' // Federal Capital Territory
];

const ELECTION_CATEGORIES = {
  NATIONAL: 'National',
  STATE: 'State'
};

const USER_ROLES = {
  ADMIN: 'admin',
  VOTER: 'voter'
};

const VOTER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive'
};

const ELECTION_STATUS = {
  PENDING: 'pending',
  ONGOING: 'ongoing',
  ENDED: 'ended'
};

module.exports = {
  NIGERIAN_STATES,
  ELECTION_CATEGORIES,
  USER_ROLES,
  VOTER_STATUS,
  ELECTION_STATUS
};

