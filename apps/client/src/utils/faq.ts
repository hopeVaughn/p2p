interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: 'Is Societas free to use?',
    answer: 'Yes! Societas is a free service. We believe in providing accessible information for everyone, everywhere.'
  },
  {
    question: 'Who is behind Societas?',
    answer: ' We are a grassroots initiative driven by a community of users just like you. We are not affiliated with any organization. Our aim is to make finding a bathroom a hassle-free experience for everyone.'
  },
  {
    question: 'How accurate are the locations on Societas?',
    answer: "The locations on Societas are community-sourced, so while we strive for accuracy, we can't guarantee perfection. Our map points are generally in close proximity to the locations provided by our users."
  },
  {
    question: 'Who verifies the accuracy of the locations?',
    answer: 'Both community members and appointed community admins regularly audit the locations provided. Our goal is to ensure the validity and usefulness of each point on our map.'
  },
  {
    question: 'How can I contribute to Societas?',
    answer: 'As a community-driven platform, we welcome and value your contributions! You can help us by adding new bathroom locations, verifying existing ones, or sharing our app with others to grow our community.'
  },
]

export default faqs
