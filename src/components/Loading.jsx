export default function Loading({ className = '', size = 'md', overlay = false } = {}) {
  const dim = size === 'sm' ? 'size-5 border-2' : size === 'lg' ? 'size-10 border-[3px]' : 'size-8 border-2'
  const ring = <div className={`${dim} animate-spin rounded-full border-primary border-t-transparent`} />

  if (overlay) {
    return (
      <div
        className={`fixed inset-0 z-[100] grid place-items-center backdrop-blur-[2px] ${className}`}
        aria-busy="true"
        aria-label="Loading"
      >
        {ring}
      </div>
    )
  }

  return (
    <div
      className={`grid min-h-[8rem] place-items-center rounded-xl backdrop-blur-[2px] ${className}`}
      aria-busy="true"
      aria-label="Loading"
    >
      {ring}
    </div>
  )
}
