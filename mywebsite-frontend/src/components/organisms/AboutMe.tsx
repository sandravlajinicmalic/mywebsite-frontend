import { Text } from '../atoms'

const AboutMe = () => {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
      <Text as="h2" size="3xl" weight="bold" className="mb-4 text-gray-900 dark:text-white">
        O meni
      </Text>
      <Text size="lg" color="muted" className="mb-4">
        Dobrodošli! Ja sam developer koji voli da kreira moderne web aplikacije koristeći najnovije tehnologije.
      </Text>
      <Text size="base" color="muted">
        Specijalizujem se za React, TypeScript i Tailwind CSS, i uvek tražim načine da poboljšam korisničko iskustvo kroz čist kod i moderan dizajn.
      </Text>
    </section>
  )
}

export default AboutMe

