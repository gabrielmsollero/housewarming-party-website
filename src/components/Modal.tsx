import { useEffect, useId, useRef, type ReactNode } from 'react';
import { btnAlt } from './ui';

type Props = { open: boolean; onClose: () => void; title: string; children: ReactNode };

export default function Modal({ open, onClose, title, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby={titleId}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-3xl bg-cream p-6 text-ink backdrop:bg-ink/45 open:flex open:flex-col open:gap-4"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 id={titleId} className="font-display text-3xl font-semibold text-rose-dark">{title}</h3>
        <button type="button" className={btnAlt} onClick={onClose}>Fechar</button>
      </div>
      {open && children}
    </dialog>
  );
}
