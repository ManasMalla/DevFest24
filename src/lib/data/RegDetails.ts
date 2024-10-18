const formFields = [
  {
    label: 'Name',
    name: 'name',
    type: 'text',
  },
  {
    label: 'Gender',
    name: 'gender',
    type: 'radio',
    options: [
      'He/Him',
      'She/Her',
      'They/Them',
      'Other',
      'Prefer not to say'
    ]
  },
  {
    label: 'Phone Number',
    name: 'phoneNumber',
    type: 'tel',
  },
  {
    label: 'Role',
    name: 'role',
    type: 'radio',
    options: [
      'Student',
      'Intern',
      'Professional',
      'Enterpreneur'
    ]
  },
  {
    label: 'Organization',
    name: 'organization',
    type: 'text',
  },
  {
    label: 'City',
    name: 'city',
    type: 'text',
  },
  {
    label: 'Profile Picture',
    name: 'profilePicture',
    type: 'file',
  },
  {
    label: 'Domains',
    name: 'domains',
    type: 'checkbox',
    options: [
      "Web",
      "Android",
      "Flutter",
      "Cloud",
      "DevOps",
      "Machine Learning / AI",
      "System Level Programming",
      "Social Media Manager",
      "Content Creator",
      "Email Team",
      "Outreach",
      "Video Editor",
      "Videographers",
      "Photographers",
      "Graphic Designer",
      "UI/UX Engineer",
      "Swag Team",
      "Content Writer",
      "On-Road Team",
      "Finance Managers",
      "Swag/Banner Management",
      "Food Management",
      "Venue Logistics Management",
      "Registration Team",
      "On-Premise Buddy",
      "Hosts",
      "Project Showcase Managers"
    ]
  },
  {
    label: 'Google Developer Profile Link',
    name: 'gdgDevLink',
    type: 'text',
  },
  {
    label: 'Do you have experience volunteering for similar events?',
    name: 'volunteerExperience',
    type: 'textarea',
  },
  {
    label: 'Resume',
    name: 'resume',
    type: 'file',
  },
  {
    label: 'Why are you interested in volunteering for DevFest 2024?',
    name: 'volunteeringInterest',
    type: 'textarea',
  },
  {
    label: 'Have you attended any of our previous events?',
    name: 'pastEvents',
    type: 'radio',
    options: [
      'Yes',
      'No'
    ]
  },
];

export default formFields;
