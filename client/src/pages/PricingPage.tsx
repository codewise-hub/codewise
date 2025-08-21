import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Star, Users, GraduationCap, Building2 } from "lucide-react";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/hooks/useAuth";

export function PricingPage() {
  const [packageType, setPackageType] = useState<'student' | 'school'>('student');
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    mode: 'signin' | 'signup';
    role?: string;
    ageGroup?: string;
  }>({
    isOpen: false,
    mode: 'signin'
  });
  const { user } = useAuth();
  const [location, setLocation] = useLocation();

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (user) {
      setLocation('/');
    }
  }, [user, setLocation]);

  const openAuthModal = (mode: 'signin' | 'signup', role?: string, ageGroup?: string) => {
    setAuthModal({ isOpen: true, mode, role, ageGroup });
  };

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, mode: 'signin' });
  };

  // Updated student packages with consistent pricing from homepage
  const studentPackages = [
    {
      id: 'young_coder_basic',
      name: 'Young Coder Basic',
      price: 'R349', // Updated to match homepage
      period: '/month',
      description: 'Perfect for children ages 6-11 starting their coding journey',
      features: [
        'Visual block-based programming',
        'Interactive coding games',
        'Basic robotics activities',
        'Progress tracking',
        'Parent dashboard access',
        '5 hours of coding content per month'
      ],
      popular: false,
      ageGroup: '6-11 years',
      color: 'blue'
    },
    {
      id: 'young_coder_premium',
      name: 'Young Coder Premium',
      price: 'R549', // Updated to match homepage premium tier
      period: '/month',
      description: 'Enhanced learning experience for young coders',
      features: [
        'Everything in Basic',
        'Advanced block programming',
        'Micro:bit simulator access',
        'Creative project challenges',
        'Video tutorials',
        'Priority support',
        'Unlimited coding content'
      ],
      popular: true,
      ageGroup: '6-11 years',
      color: 'purple'
    },
    {
      id: 'teen_coder_pro',
      name: 'Teen Coder Pro',
      price: 'R749', // Updated to match homepage premium tier
      period: '/month',
      description: 'Advanced coding education for teenagers',
      features: [
        'Text-based programming languages',
        'Web development projects',
        'AI & Prompt Engineering course',
        'Advanced robotics',
        'Code collaboration tools',
        'Career guidance',
        'Industry mentorship program'
      ],
      popular: false,
      ageGroup: '12-17 years',
      color: 'green'
    }
  ];

  const schoolPackages = [
    {
      id: 'school_standard',
      name: 'School Standard',
      price: 'R6,999',
      period: '/month',
      description: 'Perfect for small schools and classrooms',
      features: [
        'Up to 50 students',
        'Teacher dashboard',
        'Progress analytics',
        'Curriculum management',
        'Basic support',
        'Student assignments'
      ],
      popular: false,
      color: 'blue'
    },
    {
      id: 'school_premium',
      name: 'School Premium',
      price: 'R12,999',
      period: '/month',
      description: 'Comprehensive solution for larger institutions',
      features: [
        'Up to 200 students',
        'Advanced analytics',
        'Custom branding',
        'Priority support',
        'Advanced reporting',
        'Integration capabilities',
        'Professional development'
      ],
      popular: true,
      color: 'purple'
    }
  ];

  const PackageCard = ({ pkg, type }: { pkg: any, type: 'student' | 'school' }) => (
    <Card className={`relative ${pkg.popular ? 'ring-2 ring-purple-500' : ''}`}>
      {pkg.popular && (
        <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-purple-500">
          <Star className="w-3 h-3 mr-1" />
          Most Popular
        </Badge>
      )}
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {type === 'student' ? <GraduationCap className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
          {pkg.name}
        </CardTitle>
        <CardDescription>{pkg.description}</CardDescription>
        <div className="text-3xl font-bold">
          {pkg.price}
          <span className="text-sm font-normal text-gray-500">{pkg.period}</span>
        </div>
        {pkg.ageGroup && (
          <Badge variant="outline">{pkg.ageGroup}</Badge>
        )}
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 mb-6">
          {pkg.features.map((feature: string, index: number) => (
            <li key={index} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        <div className="space-y-2">
          <Button 
            onClick={() => openAuthModal('signup', type === 'student' ? 'student' : 'school_admin', pkg.ageGroup?.includes('6-11') ? '6-11' : '12-17')}
            className="w-full"
            data-testid={`button-signup-${pkg.id}`}
          >
            Get Started
          </Button>
          <Button 
            variant="outline" 
            onClick={() => openAuthModal('signin')}
            className="w-full"
            data-testid={`button-signin-${pkg.id}`}
          >
            Sign In
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Learning Journey
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Flexible pricing plans designed for individual learners and educational institutions
          </p>
        </div>

        {/* Package Type Toggle */}
        <Tabs value={packageType} onValueChange={(value) => setPackageType(value as 'student' | 'school')} className="mb-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="student" className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Student Plans
            </TabsTrigger>
            <TabsTrigger value="school" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              School Plans
            </TabsTrigger>
          </TabsList>

          <TabsContent value="student" className="mt-8">
            <div className="grid md:grid-cols-3 gap-8">
              {studentPackages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} type="student" />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="school" className="mt-8">
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {schoolPackages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} type="school" />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Need a Custom Solution?
            </h3>
            <p className="text-gray-600 mb-6">
              Contact us for enterprise pricing and custom features tailored to your organization's needs.
            </p>
            <Button variant="outline" className="px-8">
              Contact Sales
            </Button>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={authModal.isOpen}
        mode={authModal.mode}
        initialRole={authModal.role}
        initialAgeGroup={authModal.ageGroup}
        onClose={closeAuthModal}
        onSuccess={() => {
          // User will be redirected by the useEffect
          closeAuthModal();
        }}
      />
    </div>
  );
}