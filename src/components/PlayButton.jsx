import { FaPlay } from 'react-icons/fa'

const sizeClasses = {
  sm: 'h-7 w-7 text-[10px]',
  md: 'h-9 w-9 text-xs',
  lg: 'h-10 w-10 text-sm',
}

const variantClasses = {
  spotify: 'bg-[#1db954] text-black hover:brightness-110',
  white: 'bg-white text-black hover:brightness-95',
}

export function PlayButton({
  size = 'md',
  variant = 'spotify',
  className = '',
  ariaLabel = 'Play',
  iconClassName = '',
  onClick,
  disabled = false,
}) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center rounded-full transition hover:scale-105 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
    >
      <FaPlay className={`translate-x-[1px] ${iconClassName}`} />
    </button>
  )
}
