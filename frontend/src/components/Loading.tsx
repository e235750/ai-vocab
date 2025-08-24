import { twMerge } from 'tailwind-merge'

type LoadingProps = {
  message?: string
  className?: string
  svgClassName?: string
  textClassName?: string
}

export default function Loading({
  message,
  className,
  svgClassName,
  textClassName,
}: LoadingProps) {
  return (
    <div
      aria-label="Loading..."
      role="status"
      className={twMerge('flex items-center space-x-2', className)}
    >
      <svg
        className={twMerge(
          'h-20 w-20 animate-spin stroke-gray-500 dark:stroke-gray-400',
          svgClassName
        )}
        viewBox="0 0 256 256"
      >
        <line
          x1="128"
          y1="32"
          x2="128"
          y2="64"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="24"
        ></line>
        <line
          x1="195.9"
          y1="60.1"
          x2="173.3"
          y2="82.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="24"
        ></line>
        <line
          x1="224"
          y1="128"
          x2="192"
          y2="128"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="24"
        ></line>
        <line
          x1="195.9"
          y1="195.9"
          x2="173.3"
          y2="173.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="24"
        ></line>
        <line
          x1="128"
          y1="224"
          x2="128"
          y2="192"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="24"
        ></line>
        <line
          x1="60.1"
          y1="195.9"
          x2="82.7"
          y2="173.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="24"
        ></line>
        <line
          x1="32"
          y1="128"
          x2="64"
          y2="128"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="24"
        ></line>
        <line
          x1="60.1"
          y1="60.1"
          x2="82.7"
          y2="82.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="24"
        ></line>
      </svg>

      {message && (
        <span
          className={twMerge(
            'text-4xl font-medium text-gray-500 dark:text-gray-300',
            textClassName
          )}
        >
          {message}
        </span>
      )}
    </div>
  )
}
