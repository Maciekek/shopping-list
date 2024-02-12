interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children:  React.ReactNode;
}

export const Button = ({children, ...props}: ButtonProps) => {
  return (
    <button
      {...props}
      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors
              focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50
              bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
    >
      {children}
    </button>
  )
}
