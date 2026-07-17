import Navigation from "./navigation";
import SessionNotes from "./session-notes";


export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <>
      <Navigation />
      <div className="flex-1">
        {children}
      </div>
      <SessionNotes />
    </>
  )
}