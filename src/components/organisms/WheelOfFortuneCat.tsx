import { Text } from '../atoms'

const WheelOfFortuneCat = () => {
  return (
    <section className="w-full bg-transparent py-12 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <Text as="h2" size="3xl" weight="bold" className="mb-4 text-gray-900 dark:text-white">
          Wheel Of Fortune Cat
        </Text>
        <Text size="lg" color="muted">
          Ovo je sekcija za Wheel Of Fortune Cat funkcionalnost.
        </Text>
      </div>
    </section>
  )
}

export default WheelOfFortuneCat

