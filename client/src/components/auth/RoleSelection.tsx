import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, GraduationCap, User, School } from "lucide-react";

interface RoleSelectionProps {
  onRoleSelected: (role: string) => void;
}

export function RoleSelection({ onRoleSelected }: RoleSelectionProps) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const roles = [
    {
      id: 'student',
      title: 'Student',
      description: 'I want to learn coding and programming',
      icon: GraduationCap,
      color: 'text-blue-600',
      features: ['Interactive Lessons', 'Coding Projects', 'Progress Tracking', 'Achievements'],
      ageNote: 'Ages 6-17 welcome',
    },
    {
      id: 'parent',
      title: 'Parent',
      description: 'I want to monitor my child\'s learning progress',
      icon: Users,
      color: 'text-green-600',
      features: ['Link Child Accounts', 'Progress Reports', 'Activity Monitoring', 'Support Resources'],
      ageNote: 'For guardians and parents',
    },
    {
      id: 'teacher',
      title: 'Teacher',
      description: 'I want to teach coding to my students',
      icon: User,
      color: 'text-purple-600',
      features: ['Course Creation', 'Student Management', 'Analytics Dashboard', 'Curriculum Tools'],
      ageNote: 'Individual or school-based',
    },
    {
      id: 'school_admin',
      title: 'School Administrator',
      description: 'I want to manage our school\'s coding program',
      icon: School,
      color: 'text-orange-600',
      features: ['Bulk User Creation', 'School Dashboard', 'Teacher Management', 'Subscription Control'],
      ageNote: 'For educational institutions',
    },
  ];

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    onRoleSelected(roleId);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Choose Your Role
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Select how you'll be using CodewiseHub
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map((role) => {
          const isSelected = selectedRole === role.id;
          
          return (
            <Card 
              key={role.id} 
              className={`relative transition-all duration-200 hover:shadow-lg cursor-pointer ${
                isSelected ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950' : ''
              }`}
              onClick={() => handleRoleSelect(role.id)}
              data-testid={`role-card-${role.id}`}
            >
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  <role.icon className={`h-12 w-12 ${role.color}`} />
                </div>
                <CardTitle className="text-xl">{role.title}</CardTitle>
                <CardDescription>{role.description}</CardDescription>
                <Badge variant="outline" className="text-xs">
                  {role.ageNote}
                </Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    What you'll get:
                  </p>
                  {role.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => handleRoleSelect(role.id)}
                  className="w-full"
                  variant={isSelected ? "default" : "outline"}
                  data-testid={`select-role-${role.id}`}
                >
                  {isSelected ? `Selected: ${role.title}` : `Choose ${role.title}`}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedRole && (
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Great choice! Click "Continue" to proceed with your {roles.find(r => r.id === selectedRole)?.title} account.
          </p>
        </div>
      )}
    </div>
  );
}