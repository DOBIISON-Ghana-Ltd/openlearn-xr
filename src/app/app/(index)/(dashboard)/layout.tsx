import Navigation from "./navigation";


export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <>
      <Navigation />
      <div className="flex-1">
        {children}
      </div>
    </>
  )
}