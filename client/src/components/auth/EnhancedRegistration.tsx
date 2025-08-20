import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { RoleSelection } from "./RoleSelection";
import { PackageSelection } from "./PackageSelection";
import { ParentChildLinking } from "./ParentChildLinking";

interface EnhancedRegistrationProps {
  onRegistrationComplete: (userData: {
    role: string;
    packageId?: string;
    linkedChildren?: string[];
  }) => void;
}

export function EnhancedRegistration({ onRegistrationComplete }: EnhancedRegistrationProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [registrationData, setRegistrationData] = useState({
    role: "",
    packageId: "",
    linkedChildren: [] as string[],
  });

  const totalSteps = registrationData.role === 'parent' ? 3 : 2;
  const progress = (currentStep / totalSteps) * 100;

  const handleRoleSelected = (role: string) => {
    setRegistrationData(prev => ({ ...prev, role }));
    setCurrentStep(2);
  };

  const handlePackageSelected = (packageId: string) => {
    setRegistrationData(prev => ({ ...prev, packageId }));
    
    if (registrationData.role === 'parent') {
      setCurrentStep(3);
    } else {
      // Complete registration for non-parent roles
      onRegistrationComplete({
        role: registrationData.role,
        packageId,
      });
    }
  };

  const handleParentLinkingComplete = () => {
    onRegistrationComplete(registrationData);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Choose Your Role";
      case 2:
        return registrationData.role === 'school_admin' 
          ? "Select School Package" 
          : "Choose Your Package";
      case 3:
        return "Link Child Accounts";
      default:
        return "Registration";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Tell us how you'll be using CodewiseHub";
      case 2:
        return registrationData.role === 'school_admin'
          ? "Select a package that fits your institution's needs"
          : "Choose the learning package that's right for you";
      case 3:
        return "Connect to your child's existing account to monitor their progress";
      default:
        return "";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
              data-testid="button-back"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="text-sm text-gray-500">
              Step {currentStep} of {totalSteps}
            </div>
          </div>
          
          <Progress value={progress} className="w-full h-2 mb-4" />
          
          <CardTitle className="text-2xl">{getStepTitle()}</CardTitle>
          <CardDescription className="text-lg">
            {getStepDescription()}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Step Content */}
      <div className="min-h-[500px]">
        {currentStep === 1 && (
          <RoleSelection onRoleSelected={handleRoleSelected} />
        )}

        {currentStep === 2 && (
          <PackageSelection
            userRole={registrationData.role}
            onPackageSelected={handlePackageSelected}
          />
        )}

        {currentStep === 3 && registrationData.role === 'parent' && (
          <ParentChildLinking
            parentUserId="temp-parent-id" // This would be the actual parent user ID
            onLinkingComplete={handleParentLinkingComplete}
          />
        )}
      </div>

      {/* Role-specific information */}
      {registrationData.role && (
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {registrationData.role === 'student' && 
                  "Perfect! You'll get access to age-appropriate coding lessons and interactive projects."
                }
                {registrationData.role === 'parent' && 
                  "Great choice! You'll be able to monitor your child's learning progress and achievements."
                }
                {registrationData.role === 'teacher' && 
                  "Excellent! You'll have access to course creation tools and student management features."
                }
                {registrationData.role === 'school_admin' && 
                  "Perfect! You'll be able to manage your school's entire coding program and create accounts for teachers and students."
                }
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}