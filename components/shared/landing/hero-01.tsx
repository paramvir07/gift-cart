"use client"

import * as React from "react"
import { ArrowRight, Menu, X, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Logo } from "../Logo"

const navItems = ["How it works", "Prizes", "Winners", "FAQ"]

const stats = [
  { value: "$12,400", label: "This week's jackpot" },
  { value: "1,208", label: "Tickets sold today" },
  { value: "312", label: "Winners paid out" },
]

export default function Hero01() {
  const [menuOpen, setMenuOpen] = React.useState(false)

  return (
    <section className="relative isolate overflow-hidden bg-background pb-24 sm:pb-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-48 left-1/2 -z-10 h-160 w-5xl max-w-[140%] -translate-x-1/2 opacity-50"
        style={{
          background:
            "radial-gradient(closest-side, rgba(245, 158, 11, 0.18), transparent 60%)",
        }}
      />

      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:px-8">
        <div className="flex items-center gap-2 font-semibold tracking-tight text-foreground">
          <Logo />
        </div>

        <nav className="hidden items-center gap-7 md:flex">
          {navItems.map(function (item) {
            return (
              <a
                key={item}
                href={"#" + item.toLowerCase().replace(/\s+/g, "-")}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item}
              </a>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="hidden rounded-full sm:inline-flex"
          >
            Sign in
          </Button>
          <Button size="sm" className="rounded-full px-4">
            Enter now
          </Button>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="grid size-9 place-items-center rounded-full border border-border text-foreground md:hidden"
          >
            <Menu className="size-4" />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div
            aria-hidden
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute inset-x-4 top-4 rounded-2xl border border-border bg-card p-5 shadow-2xl shadow-black/30">
            <div className="flex items-center justify-between">
              <span className="font-semibold tracking-tight">luckydraw</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
            <ul className="mt-5 flex flex-col">
              {navItems.map(function (item) {
                return (
                  <li key={item}>
                    <a
                      href={"#" + item.toLowerCase().replace(/\s+/g, "-")}
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                    >
                      {item}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}

      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 pt-16 text-center sm:pt-20">
        <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
          <Clock className="size-3.5" />
          Next draw in 03:14:22
        </span>

        <h1
          className="font-semibold tracking-tight text-balance text-foreground"
          style={{
            fontSize: "clamp(2.75rem, 6vw, 5rem)",
            lineHeight: 1.02,
            letterSpacing: "-0.035em",
          }}
        >
          Buy a coupon.
          <br />
          Win a real prize.
        </h1>

        <p className="max-w-xl text-base text-balance text-muted-foreground sm:text-lg">
          Every ticket enters this weekend&apos;s live draw. Transparent odds,
          real winners, no catch.
        </p>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" className="rounded-full px-7">
            Get your ticket
            <ArrowRight />
          </Button>
          <Button size="lg" variant="outline" className="rounded-full px-7">
            See this week&apos;s prize
          </Button>
        </div>

        <div className="mt-10 grid w-full max-w-xl grid-cols-3 gap-3">
          {stats.map(function (stat) {
            return (
              <div
                key={stat.label}
                className="rounded-xl border border-border bg-card px-3 py-4 text-center"
              >
                <div className="text-xl font-semibold tracking-tight sm:text-2xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
