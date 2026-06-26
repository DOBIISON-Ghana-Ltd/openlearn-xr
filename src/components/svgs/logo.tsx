import { memo } from "react"

type SvgProps = React.ComponentPropsWithoutRef<"svg">

export const LogoSvg = memo(({ className, ...props }: SvgProps) => {
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M31.998 34.123L29.877 36.2441L22.5381 28.9053L22.5391 42L21.0381 41.999L19.5371 42V28.9062L12.1992 36.2441L10.0781 34.123L21.0381 23.1631L31.998 34.123Z" fill="currentColor" />
      <path d="M18.917 21.042L7.95703 32.002L5.83594 29.8809L13.1748 22.541H0V19.542H13.1748L5.83594 12.2031L7.95703 10.0811L18.917 21.042Z" fill="currentColor" />
      <path d="M36.2402 12.2031L28.9014 19.542H41.9961V22.541H28.9014L36.2402 29.8809L34.1191 32.002L23.1592 21.042L34.1191 10.0811L36.2402 12.2031Z" fill="currentColor" />
      <path d="M22.5381 13.1777L29.877 5.83887L31.998 7.95996L21.0381 18.9199L10.0781 7.95996L12.1992 5.83887L19.5381 13.1777V0H22.5381V13.1777Z" fill="currentColor" />
    </svg>
  )
})

LogoSvg.displayName = "LogoSvg"


