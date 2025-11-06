import { useState } from 'react'
import { Text, Button } from '../atoms'
import { Modal } from '../molecules'

const WebsocketCat = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
        <Text as="h2" size="3xl" weight="bold" className="mb-4 text-gray-900 dark:text-white">
          Websocket Cat
        </Text>
        <Text size="lg" color="muted" className="mb-6">
          Ovo je sekcija za Websocket Cat funkcionalnost.
        </Text>
        <Button onClick={() => setIsModalOpen(true)}>
          Otvori Modal
        </Button>
      </section>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Websocket Cat Modal"
        size="md"
      >
        <Text size="base" color="muted" className="mb-4">
          Ovo je primjer modal komponente koja se može koristiti na više mjesta u aplikaciji.
        </Text>
        <Text size="base" color="muted" className="mb-6">
          Modal se može zatvoriti klikom na backdrop, ESC tipkom ili dugmetom za zatvaranje.
        </Text>
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            Zatvori
          </Button>
          <Button onClick={() => setIsModalOpen(false)}>
            Potvrdi
          </Button>
        </div>
      </Modal>
    </>
  )
}

export default WebsocketCat
