import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Users, Star } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Package } from "@shared/schema";

interface PackageSelectionProps {
  userRole: string;
  onPackageSelected: (packageId: string) => void;
}

export function PackageSelection({ userRole, onPackageSelected }: PackageSelectionProps) {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: packages, isLoading } = useQuery<Package[]>({
    queryKey: ["/api/packages", userRole],
    queryFn: async () => {
      const response = await apiRequest(`/api/packages?type=${userRole === 'school_admin' ? 'school' : 'individual'}`);
      return response;
    },
  });

  const selectPackageMutation = useMutation({
    mutationFn: async (packageId: string) => {
      return await apiRequest("/api/users/select-package", "POST", { packageId });
    },
    onSuccess: () => {
      toast({
        title: "Package Selected",
        description: "Your package has been selected successfully!",
      });
      onPackageSelected(selectedPackage!);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to select package. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSelectPackage = (packageId: string) => {
    setSelectedPackage(packageId);
    selectPackageMutation.mutate(packageId);
  };

  const getPackageIcon = (packageName: string) => {
    if (packageName.includes('Premium') || packageName.includes('Pro')) {
      return <Crown className="h-6 w-6 text-yellow-500" />;
    }
    if (packageName.includes('School')) {
      return <Users className="h-6 w-6 text-blue-500" />;
    }
    return <Star className="h-6 w-6 text-gray-500" />;
  };

  const parseFeatures = (features: string | null): string[] => {
    if (!features) return [];
    try {
      return JSON.parse(features);
    } catch {
      return [];
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-2">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Choose Your {userRole === 'school_admin' ? 'School' : 'Learning'} Package
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {userRole === 'school_admin' 
            ? 'Select a package that fits your institution\'s needs'
            : 'Select a package to start your coding journey'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages?.map((pkg) => {
          const features = parseFeatures(pkg.features);
          const isPopular = pkg.name.includes('Basic') || pkg.name.includes('Premium');
          
          return (
            <Card 
              key={pkg.id} 
              className={`relative transition-all duration-200 hover:shadow-lg ${
                selectedPackage === pkg.id ? 'ring-2 ring-blue-500' : ''
              } ${isPopular ? 'border-blue-200 dark:border-blue-800' : ''}`}
              data-testid={`package-card-${pkg.id}`}
            >
              {isPopular && (
                <Badge 
                  className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white"
                >
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  {getPackageIcon(pkg.name)}
                </div>
                <CardTitle className="text-xl">{pkg.name}</CardTitle>
                <CardDescription>{pkg.description}</CardDescription>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {pkg.price === 0 ? 'Free' : `$${pkg.price}`}
                  {pkg.price > 0 && (
                    <span className="text-sm font-normal text-gray-500">
                      /{pkg.duration}
                    </span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {pkg.maxStudents && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Up to {pkg.maxStudents} students</strong>
                  </div>
                )}

                <Button
                  onClick={() => handleSelectPackage(pkg.id)}
                  disabled={selectPackageMutation.isPending}
                  className="w-full"
                  variant={pkg.price === 0 ? "outline" : "default"}
                  data-testid={`select-package-${pkg.id}`}
                >
                  {selectPackageMutation.isPending && selectedPackage === pkg.id
                    ? "Selecting..."
                    : pkg.price === 0
                    ? "Start Free"
                    : `Choose ${pkg.name}`
                  }
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}