"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Lock, Mail, Sparkles, ShieldAlert, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const loginSchema = z.object({
  email: z.string().email("Alamat email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      // Simulation or real POST /api/auth/admin/login call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Login berhasil! Mengalihkan ke dasbor...");
      router.push("/");
    } catch (error) {
      toast.error((error as Error).message || "Gagal masuk. Periksa email dan password Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-slate-800 bg-slate-900/90 text-white shadow-2xl backdrop-blur-xl">
      <CardHeader className="space-y-3 text-center pb-6">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <div>
          <CardTitle className="text-2xl font-bold tracking-tight text-white">
            Momen Invite Admin
          </CardTitle>
          <CardDescription className="text-slate-400 mt-1 text-xs">
            Portal Administrasi Terpusat & Audit Keuangan Ekosistem
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-semibold text-slate-300">
              Email Administrator
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                id="email"
                type="email"
                placeholder="admin@momeninvite.com"
                className="pl-9 bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-primary"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-rose-400">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-semibold text-slate-300">
                Password
              </Label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-9 bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-primary"
                {...register("password")}
              />
            </div>
            {errors.password && (
              <p className="text-xs text-rose-400">{errors.password.message}</p>
            )}
          </div>

          <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-[11px] text-amber-300 flex items-start gap-2">
            <ShieldAlert className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
            <span>
              Sistem menerapkan <strong>Brute-Force Lockout</strong>: 5x kegagalan berturut-turut akan mengunci akun selama 15 menit.
            </span>
          </div>

          <Button
            type="submit"
            className="w-full font-semibold shadow-lg transition-all"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memverifikasi...
              </>
            ) : (
              "Masuk ke Dasbor"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
