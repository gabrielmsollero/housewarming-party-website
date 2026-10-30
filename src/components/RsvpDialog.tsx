import { useState } from 'react';
import { config } from '../config';
import Modal from './Modal';
import { btn, btnAlt, field, label } from './ui';

export default function RsvpDialog() {
  const [open, setOpen] = useState(false);
  const [guests, setGuests] = useState(['']);

  const names = guests.map((guest) => guest.trim()).filter(Boolean);
  const href = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(`Oi! Confirmando presença no chá de casa nova: ${names.join(', ')}.`)}`;

  const update = (index: number, value: string) =>
    setGuests(guests.map((guest, i) => (i === index ? value : guest)));
  const remove = (index: number) =>
    setGuests(guests.length > 1 ? guests.filter((_, i) => i !== index) : ['']);

  return (
    <>
      <button
        type="button"
        className={`${btn} min-h-13 px-8 text-[17px]`}
        onClick={() => setOpen(true)}
      >
        Confirmar presença
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Confirmar presença"
      >
        <p className="text-[15px] leading-normal">
          Coloque o seu nome e o de quem vai com você.
        </p>
        {guests.map((guest, index) => (
          <div key={index} className="flex items-end gap-2">
            <label className={`${label} flex-1`}>
              Nome {index + 1}
              <input
                className={field}
                value={guest}
                onChange={(e) => update(index, e.target.value)}
              />
            </label>
            {guests.length > 1 && (
              <button
                type="button"
                className={btnAlt}
                onClick={() => remove(index)}
              >
                Remover
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          className={btnAlt}
          onClick={() => setGuests([...guests, ''])}
        >
          Adicionar pessoa
        </button>
        {names.length > 0 ? (
          <a
            className={btn}
            href={href}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
          >
            Confirmar
          </a>
        ) : (
          <button type="button" className={`${btn} opacity-50`} disabled>
            Confirmar
          </button>
        )}
      </Modal>
    </>
  );
}
