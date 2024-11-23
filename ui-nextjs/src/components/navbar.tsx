import {
  User,
  Download,
  Star,
  CreditCard,
  Users,
  Rocket,
  LogOutIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ModeToggle } from "./theme/ModeToggle";
import LogoIcon from "./icons/logoIcon";
import { getSession } from "@/auth/lib";

export default async function Navbar() {
  const session = await getSession();

  return (
    <header className="w-full border-b bg-card">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <LogoIcon />
            </Link>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/session">
              <Button variant={"outline"}>
                <p>session</p>
              </Button>
            </Link>
            <Link href="/test-auth">
              <Button variant={"outline"}>
                <p>test</p>
              </Button>
            </Link>
            <ModeToggle />
            <Link href="/planos">
              <Button>
                <Rocket className="h-4 w-4" />
                <p>Assinar</p>
              </Button>
            </Link>

            {!session ? (
              <Link href="/login">
                <Button>Login</Button>
              </Link>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={"/placeholder.svg?height=96&width=96"}
                        alt="Profile picture"
                      />
                      <AvatarFallback>
                        <User className="w-12 h-12" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel className="flex m-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {session.user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/perfil">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Meu perfil</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/downloads">
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      <span>Downloads</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/favoritos">
                    <DropdownMenuItem>
                      <Star className="mr-2 h-4 w-4" />
                      <span>Favoritos</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/assinatura">
                    <DropdownMenuItem>
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Assinatura</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/seguindo">
                    <DropdownMenuItem>
                      <Users className="mr-2 h-4 w-4" />
                      <span>Seguindo</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOutIcon />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
