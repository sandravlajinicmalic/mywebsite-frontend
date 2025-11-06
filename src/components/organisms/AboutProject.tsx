import { Text } from '../atoms'

const AboutProject = () => {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
      <Text as="h2" size="3xl" weight="bold" className="mb-4 text-gray-900 dark:text-white">
        O projektu
      </Text>
      <Text size="lg" color="muted" className="mb-4">
        Ovaj projekat je izgrađen koristeći Atomic Design pattern, što omogućava bolju organizaciju i reusability komponenti.
      </Text>
      <Text size="base" color="muted" className="mb-4">
        Tehnologije korišćene u projektu:
      </Text>
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li>
          <Text size="base" color="muted">React sa TypeScript-om za type safety</Text>
        </li>
        <li>
          <Text size="base" color="muted">Vite za brzu razvojnu okolinu</Text>
        </li>
        <li>
          <Text size="base" color="muted">Tailwind CSS za stilizaciju</Text>
        </li>
        <li>
          <Text size="base" color="muted">React Router za navigaciju</Text>
        </li>
      </ul>
    </section>
  )
}

export default AboutProject

