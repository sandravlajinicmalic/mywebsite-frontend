import { Text } from '../atoms'

const WheelOfFortuneCat = () => {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
      <Text as="h2" size="3xl" weight="bold" className="mb-4 text-gray-900 dark:text-white">
        Wheel Of Fortune Cat
      </Text>
      <Text size="lg" color="muted">
        Ovo je sekcija za Wheel Of Fortune Cat funkcionalnost.
      </Text>
    </section>
  )
}

export default WheelOfFortuneCat

