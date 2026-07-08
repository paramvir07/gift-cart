import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { Logo } from "../Logo"

const navLinks = [
  { label: "About", href: "#" },
  { label: "Services", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Company", href: "#" },
  { label: "Resources", href: "#" },
]

export function SheetNavbar() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline"><Menu /></Button>} />
      <SheetContent showCloseButton={true}>
        <SheetHeader>
          <SheetTitle>
            <Logo/>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-1 px-4">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      <SheetFooter>
        <div className="mt-4 flex flex-col gap-2 ">
          <Button variant="outline" className="w-full rounded-full">
            Sign in
          </Button>
          <Button className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
            Register
          </Button>
        </div>
      </SheetFooter>

      </SheetContent>
    </Sheet>
  )
}