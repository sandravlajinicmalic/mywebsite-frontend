import { Text } from '../atoms'

const ContactForm = () => {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
      <Text as="h2" size="3xl" weight="bold" className="mb-4 text-gray-900 dark:text-white">
        Kontakt forma
      </Text>
      <Text size="lg" color="muted" className="mb-4">
        Ako želite da me kontaktirate, molimo vas da popunite kontakt formu ispod.
      </Text>
      <Text size="base" color="muted">
        Kontakt forma će biti implementirana u narednim koracima. Ovdje ćete moći da pošaljete poruku direktno sa sajta.
      </Text>
    </section>
  )
}

export default ContactForm

