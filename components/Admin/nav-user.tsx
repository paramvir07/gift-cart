"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserIcon, SettingsIcon, LogOutIcon } from "lucide-react"

const user = {
  name: "GC Admin",
  email: "admin@admin.com",
  avatar:
    "https://i.pinimg.com/control1/1200x/2b/2e/81/2b2e81bb72ede3ab745ba1d8d0ca3bb4.jpg",
}

export function NavUser() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<button type="button" className="rounded-full outline-none" />}
      >
        <Avatar className="size-8">
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-3 font-normal">
            <Avatar className="size-10">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <span className="font-medium text-foreground">{user.name}</span>
              <br />
              <div className="max-w-full overflow-hidden text-xs overflow-ellipsis whitespace-nowrap text-muted-foreground">
                {user.email}
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <UserIcon />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem>
            <SettingsIcon />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup></DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="w-full cursor-pointer"
            variant="destructive"
          >
            <LogOutIcon />
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
