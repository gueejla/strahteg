/// <reference types="vite/client" />

declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}

// Tailwind CSS class names for better IntelliSense
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
    }
  }
} 