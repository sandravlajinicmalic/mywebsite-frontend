import { Text } from '../atoms'

const SmartCat = () => {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
      <Text as="h2" size="3xl" weight="bold" className="mb-4 text-gray-900 dark:text-white">
        Smart Cat
      </Text>
      <Text size="lg" color="muted">
        Ovo je sekcija za Smart Cat funkcionalnost.
      </Text>
    </section>
  )
}

export default SmartCat

