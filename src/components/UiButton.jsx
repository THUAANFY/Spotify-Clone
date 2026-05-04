const variants = {
  ghost: 'rounded-full bg-neutral-800 px-4 py-2 text-sm text-white hover:bg-neutral-700',
  menu: 'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white',
}

export function UiButton({ children, icon, variant = 'ghost', type = 'button' }) {
  return (
    <button type={type} className={variants[variant]}>
      {icon ? <span className="text-base">{icon}</span> : null}
      <span>{children}</span>
    </button>
  )
}
