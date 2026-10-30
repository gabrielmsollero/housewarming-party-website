import QRCode from 'qrcode';
import { useEffect, useMemo, useState } from 'react';
import { config } from '../config';
import { buildPix } from '../lib/pix';
import Modal from './Modal';
import { btn, btnAlt, field, label } from './ui';

export type Gift = {
  id: number;
  title: string;
  price: number;
  done: boolean;
  image?: string;
  stripeUrl?: string;
};

const brl = (value: number) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
  });

function PayForm({ gift, onDone }: { gift: Gift | null; onDone: () => void }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState(gift ? String(gift.price) : '');
  const [method, setMethod] = useState<'pix' | 'card'>('pix');
  const [qr, setQr] = useState('');
  const [copied, setCopied] = useState(false);

  const value = Number(amount.replace(',', '.'));
  const pixCode = useMemo(
    () => (value > 0 ? buildPix({ ...config.pix, amount: value }) : ''),
    [value],
  );

  useEffect(() => {
    if (!pixCode) return setQr('');
    QRCode.toDataURL(pixCode, { margin: 1, width: 320 }).then(setQr);
  }, [pixCode]);

  const copy = async () => {
    await navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const message = `Oi! Acabei de fazer um presente no chá de casa nova: ${gift?.title ?? 'Qualquer valor'} (${brl(value || 0)}). De: ${name || '[nome]'}`;
  const whatsappHref = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`;

  return (
    <>
      <label className={label}>
        Seu nome
        <input
          className={field}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Como devemos te chamar?"
        />
      </label>
      <label className={label}>
        Valor (R$)
        <input
          className={field}
          inputMode="decimal"
          value={amount}
          disabled={!!gift}
          onChange={(e) => setAmount(e.target.value)}
        />
      </label>
      <div className="flex gap-2">
        <button
          type="button"
          className={`${method === 'pix' ? btn : btnAlt} flex-1`}
          onClick={() => setMethod('pix')}
        >
          Pix
        </button>
        <button
          type="button"
          className={`${method === 'card' ? btn : btnAlt} flex-1`}
          onClick={() => setMethod('card')}
        >
          Cartão
        </button>
      </div>
      {method === 'pix' ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-4">
          {pixCode ? (
            <>
              {qr && <img src={qr} alt="QR code do Pix" className="size-40" />}
              <div className="w-full break-all rounded-lg bg-stone-100 p-2.5 font-mono text-xs">
                {pixCode}
              </div>
              <button type="button" className={`${btn} w-full`} onClick={copy}>
                {copied ? 'Copiado!' : 'Copiar código'}
              </button>
            </>
          ) : (
            <p className="text-sm">Informe o valor para gerar o Pix.</p>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3 rounded-2xl bg-white p-4">
          {!gift && (
            <p className="text-sm leading-normal">
              No cartão, você digita o valor na página de pagamento.
            </p>
          )}
          <a
            className={btn}
            href={gift?.stripeUrl ?? config.stripe.anyAmount}
            target="_blank"
            rel="noreferrer"
          >
            Ir para o pagamento
          </a>
        </div>
      )}
      <a
        className={btnAlt}
        href={whatsappHref}
        target="_blank"
        rel="noreferrer"
        onClick={onDone}
      >
        Já paguei
      </a>
    </>
  );
}

export default function GiftList({ gifts }: { gifts: Gift[] }) {
  const [open, setOpen] = useState(false);
  const [gift, setGift] = useState<Gift | null>(null);
  const pick = (selected: Gift | null) => {
    setGift(selected);
    setOpen(true);
  };

  return (
    <section aria-labelledby="gifts" className="flex w-full flex-col gap-6">
      <h2
        id="gifts"
        className="text-center font-display text-4xl font-semibold text-rose-dark"
      >
        Lista de presentes
      </h2>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
        <div className="flex min-h-64 flex-col items-center justify-center gap-2.5 rounded-2xl border-2 border-dashed border-mint-dark/50 bg-mint/60 p-5 text-center">
          <h3 className="font-display text-3xl font-semibold text-mint-dark">
            Qualquer valor
          </h3>
          <p className="text-[15px] leading-normal">
            Prefere escolher quanto contribuir? Fica à vontade.
          </p>
          <button type="button" className={btn} onClick={() => pick(null)}>
            Contribuir
          </button>
        </div>
        {gifts.map((item) => (
          <article
            key={item.id}
            className={`flex flex-col overflow-hidden rounded-2xl bg-white shadow-md ${item.done ? 'opacity-60' : ''}`}
          >
            {item.image ? (
              <img
                src={item.image}
                alt={item.title}
                className="h-36 w-full object-cover"
              />
            ) : (
              <div className="flex h-36 items-center justify-center bg-rose-soft text-sm font-semibold text-ink/70">
                [foto do item]
              </div>
            )}
            <div className="flex flex-1 flex-col gap-2 p-4">
              <h3 className="font-display text-2xl leading-tight">
                {item.title}
              </h3>
              <p className="text-lg font-bold text-rose-dark">
                {brl(item.price)}
              </p>
              {item.done && (
                <span className="self-start rounded-full bg-mint px-3 py-1 text-[13px] font-bold text-mint-dark">
                  Já ganhamos
                </span>
              )}
              <button
                type="button"
                className={`${btn} mt-auto w-full`}
                onClick={() => pick(item)}
              >
                Presentear
              </button>
            </div>
          </article>
        ))}
      </div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={gift?.title ?? 'Qualquer valor'}
      >
        <PayForm gift={gift} onDone={() => setOpen(false)} />
      </Modal>
    </section>
  );
}
