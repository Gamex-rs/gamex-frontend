import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

export const HomeIcon = (p: IconProps) => (
  <Icon {...p}><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" /></Icon>
)

export const SearchIcon = (p: IconProps) => (
  <Icon {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Icon>
)

export const LibraryIcon = (p: IconProps) => (
  <Icon {...p}><rect x="3" y="4" width="5" height="16" rx="1" /><rect x="10" y="4" width="5" height="16" rx="1" /><path d="m17 5 3.5 14" /></Icon>
)

export const MessageIcon = (p: IconProps) => (
  <Icon {...p}><path d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12z" /></Icon>
)

export const UserIcon = (p: IconProps) => (
  <Icon {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></Icon>
)

export const FilterIcon = (p: IconProps) => (
  <Icon {...p}><path d="M4 5h16M7 12h10M10 19h4" /></Icon>
)

export const ChevronLeftIcon = (p: IconProps) => (
  <Icon {...p}><path d="m15 18-6-6 6-6" /></Icon>
)

export const ChevronRightIcon = (p: IconProps) => (
  <Icon {...p}><path d="m9 18 6-6-6-6" /></Icon>
)

export const GamepadIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 9h4M8 7v4M15 10h.01M18 12h.01" />
    <path d="M7 5h10a5 5 0 0 1 4.9 6l-.9 5a3 3 0 0 1-5.2 1.5L14 15h-4l-1.8 2.5A3 3 0 0 1 3 16l-.9-5A5 5 0 0 1 7 5z" />
  </Icon>
)

export const CloseIcon = (p: IconProps) => (
  <Icon {...p}><path d="M18 6 6 18M6 6l12 12" /></Icon>
)
