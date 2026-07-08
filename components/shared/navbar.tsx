import Link from "next/link"
import { Logo } from "./Logo"
import { Button } from "@/components/ui/button"
import { SheetNavbar } from "./landing/SheetNavbar"

const navLinks = [
  { label: "About", href: "#" },
  { label: "Services", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Company", href: "#" },
  { label: "Resources", href: "#" },
]

const Navbar = () => {
  return (
    <div className="flex h-16 w-full items-center justify-between border-b bg-background px-4">
      <Logo />

      <nav className="hidden items-center gap-8 md:flex">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </nav>



      <div className="flex items-center gap-2">
        <Button variant="outline" className="rounded-full hidden md:flex">
          Sign in
        </Button>
        <Button className="hidden md:flex rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
          Register
        </Button>
        <Button className="md:hidden rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
          Get Started
        </Button>
        <div className="md:hidden">
        <SheetNavbar/>
        </div>
      </div>
    </div>
  )
}

export default Navbar