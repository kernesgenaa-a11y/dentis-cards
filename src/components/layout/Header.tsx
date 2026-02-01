import React from 'react';
import { useClinic } from '@/context/ClinicContext';
import { useAuth } from '@/context/AuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Stethoscope, LogOut, User, Shield } from 'lucide-react';

export function Header() {
  const { clinicName, doctors, selectedDoctorId, setSelectedDoctorId } = useClinic();
  const { currentUser, logout } = useAuth();

  const getRoleBadge = (role: string) => {
    const variants: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
      'super-admin': { label: 'Super Admin', variant: 'default' },
      'doctor': { label: 'Doctor', variant: 'secondary' },
      'administrator': { label: 'Admin', variant: 'outline' },
    };
    return variants[role] || { label: role, variant: 'outline' as const };
  };

  const roleInfo = currentUser ? getRoleBadge(currentUser.role) : null;

  return (
    <header className="header-gradient text-primary-foreground shadow-lg">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-lg leading-none">{clinicName}</h1>
              <p className="text-xs opacity-80">Dental Management System</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Doctor Selection */}
          <div className="flex items-center gap-2">
            <span className="text-sm opacity-80">Doctor:</span>
            <Select value={selectedDoctorId || ''} onValueChange={setSelectedDoctorId}>
              <SelectTrigger className="w-48 bg-white/10 border-white/20 text-primary-foreground">
                <SelectValue placeholder="Select doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map(doctor => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    <div className="flex flex-col">
                      <span>{doctor.name}</span>
                      <span className="text-xs text-muted-foreground">{doctor.specialty}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* User Menu */}
          {currentUser && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 hover:bg-white/10">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-white/20 text-primary-foreground text-sm">
                      {currentUser.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                    <Badge 
                      variant={roleInfo?.variant} 
                      className="mt-0.5 text-[10px] h-4 bg-white/20 text-primary-foreground border-white/30"
                    >
                      {roleInfo?.label}
                    </Badge>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground">@{currentUser.username}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2">
                  <User className="w-4 h-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <Shield className="w-4 h-4" />
                  <div className="flex items-center justify-between flex-1">
                    <span>Role</span>
                    <Badge variant="outline" className="text-[10px]">{roleInfo?.label}</Badge>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 text-destructive" onClick={logout}>
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
